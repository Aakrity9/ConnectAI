import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async saveMessage(senderProfileId: string, receiverProfileId: string, content: string) {
    return this.prisma.message.create({
      data: {
        senderId: senderProfileId,
        receiverId: receiverProfileId,
        content,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
  }

  async getConversationHistory(clerkId: string, contactProfileId: string, limit = 50, offset = 0) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      throw new NotFoundException('Active profile not found');
    }

    const profileId = user.profile.id;

    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: profileId, receiverId: contactProfileId },
          { senderId: contactProfileId, receiverId: profileId },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
      skip: Number(offset),
      take: Number(limit),
      include: {
        sender: true,
        receiver: true,
      },
    });
  }
}
