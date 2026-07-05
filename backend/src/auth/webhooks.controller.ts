import { Controller, Post, Headers, Req, Res, BadRequestException } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Webhook } from 'svix';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  @Post('clerk')
  async handleClerkWebhook(
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    const webhookSecret = this.configService.get<string>('CLERK_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('CLERK_WEBHOOK_SECRET is not configured');
      return res.status(500).json({ error: 'Webhook secret is not configured' });
    }

    if (!svixId || !svixTimestamp || !svixSignature) {
      throw new BadRequestException('Missing svix headers');
    }

    const payload = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);
    const headers = {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    };

    const wh = new Webhook(webhookSecret);
    let evt: any;

    try {
      evt = wh.verify(payload, headers);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const { type, data } = evt;

    if (type === 'user.created') {
      const email = data.email_addresses?.[0]?.email_address;
      const clerkId = data.id;

      if (!email || !clerkId) {
        return res.status(400).json({ error: 'Missing user email or clerkId' });
      }

      await this.prisma.user.create({
        data: {
          email,
          clerkId,
          profile: {
            create: {
              name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Attendee',
              photo: data.image_url || '',
            },
          },
        },
      });
      console.log(`User created and profile initialized: ${email}`);
    } else if (type === 'user.updated') {
      const email = data.email_addresses?.[0]?.email_address;
      const clerkId = data.id;

      if (email && clerkId) {
        await this.prisma.user.update({
          where: { clerkId },
          data: {
            email,
            profile: {
              update: {
                name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Attendee',
                photo: data.image_url || '',
              },
            },
          },
        });
        console.log(`User updated: ${email}`);
      }
    } else if (type === 'user.deleted') {
      const clerkId = data.id;
      if (clerkId) {
        await this.prisma.user.delete({
          where: { clerkId },
        });
        console.log(`User deleted: ${clerkId}`);
      }
    }

    return res.status(200).json({ success: true });
  }
}
