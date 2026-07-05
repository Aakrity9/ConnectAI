import type { RawBodyRequest } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class WebhooksController {
    private configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    handleClerkWebhook(svixId: string, svixTimestamp: string, svixSignature: string, req: RawBodyRequest<Request>, res: Response): Promise<Response<any, Record<string, any>>>;
}
