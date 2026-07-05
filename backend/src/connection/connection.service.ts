import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConnectionService {
  constructor(private prisma: PrismaService) {}

  async sendRequest(senderClerkId: string, receiverId: string) {
    const senderUser = await this.prisma.user.findUnique({
      where: { clerkId: senderClerkId },
      include: { profile: true },
    });

    if (!senderUser || !senderUser.profile) {
      throw new NotFoundException('Sender profile not found');
    }

    const receiver = await this.prisma.profile.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      throw new NotFoundException('Receiver profile not found');
    }

    if (senderUser.profile.id === receiverId) {
      throw new BadRequestException('You cannot connect with yourself');
    }

    const existingRequest = await this.prisma.connectionRequest.findFirst({
      where: {
        OR: [
          { senderId: senderUser.profile.id, receiverId },
          { senderId: receiverId, receiverId: senderUser.profile.id },
        ],
      },
    });

    if (existingRequest) {
      throw new BadRequestException('Connection request already exists or you are already connected');
    }

    return this.prisma.connectionRequest.create({
      data: {
        senderId: senderUser.profile.id,
        receiverId,
        status: 'PENDING',
      },
    });
  }

  async respondToRequest(clerkId: string, requestId: string, status: 'ACCEPTED' | 'DECLINED') {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      throw new NotFoundException('User profile not found');
    }

    const request = await this.prisma.connectionRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Connection request not found');
    }

    if (request.receiverId !== user.profile.id) {
      throw new BadRequestException('You are not authorized to respond to this request');
    }

    return this.prisma.connectionRequest.update({
      where: { id: requestId },
      data: { status },
    });
  }

  async getPendingRequests(clerkId: string) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      throw new NotFoundException('User profile not found');
    }

    return this.prisma.connectionRequest.findMany({
      where: {
        receiverId: user.profile.id,
        status: 'PENDING',
      },
      include: {
        sender: true,
      },
    });
  }

  async getConnectionsList(clerkId: string) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      throw new NotFoundException('User profile not found');
    }

    const profileId = user.profile.id;

    const connections = await this.prisma.connectionRequest.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [
          { senderId: profileId },
          { receiverId: profileId },
        ],
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    return connections.map((conn) => {
      return conn.senderId === profileId ? conn.receiver : conn.sender;
    });
  }
}
