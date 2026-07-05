import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { verifyToken } from '@clerk/backend';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Map to associate socket IDs with Profile IDs
  private socketToProfile = new Map<string, string>();
  // Map to associate Profile IDs with active sockets (for direct delivery checks)
  private profileToSockets = new Map<string, Set<string>>();

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private chatService: ChatService,
  ) {}

  async handleConnection(socket: Socket) {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers['authorization']?.split(' ')[1] ||
      socket.handshake.query?.token;

    if (!token || typeof token !== 'string') {
      console.log(`WebSocket connection rejected: Missing token for socket ${socket.id}`);
      socket.disconnect();
      return;
    }

    const secretKey = this.configService.get<string>('CLERK_SECRET_KEY');
    let clerkId: string;

    if (!secretKey || secretKey === 'mock' || token.startsWith('mock-')) {
      clerkId = token.startsWith('mock-') ? token : 'mock-user-123';
    } else {
      try {
        const verified = await verifyToken(token, { secretKey });
        clerkId = verified.sub;
      } catch (error: any) {
        console.log(`WebSocket auth failed: ${error.message} for socket ${socket.id}`);
        socket.disconnect();
        return;
      }
    }

    try {
      let user = await this.prisma.user.findUnique({
        where: { clerkId },
        include: { profile: true },
      });

      // Bypasses database constraints for local mock preview mode
      if (!user && (clerkId === 'mock-user-123' || clerkId.startsWith('mock-'))) {
        user = await this.prisma.user.findFirst({
          include: { profile: true },
        });
      }

      if (!user || !user.profile) {
        console.log(`WebSocket user/profile not found: ${clerkId}`);
        socket.disconnect();
        return;
      }

      const profileId = user.profile.id;

      // Map socket to profile
      this.socketToProfile.set(socket.id, profileId);
      
      if (!this.profileToSockets.has(profileId)) {
        this.profileToSockets.set(profileId, new Set());
      }
      this.profileToSockets.get(profileId)!.add(socket.id);

      // Join profile-specific room for direct notifications
      socket.join(profileId);
      console.log(`WebSocket client authenticated and connected: ${profileId} (${user.email})`);
    } catch (error: any) {
      console.log(`WebSocket auth failed: ${error.message} for socket ${socket.id}`);
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    const profileId = this.socketToProfile.get(socket.id);
    if (profileId) {
      this.socketToProfile.delete(socket.id);
      
      const sockets = this.profileToSockets.get(profileId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          this.profileToSockets.delete(profileId);
        }
      }
      console.log(`WebSocket client disconnected: ${profileId}`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { receiverId: string; content: string },
  ) {
    const senderId = this.socketToProfile.get(socket.id);
    if (!senderId) {
      socket.disconnect();
      return;
    }

    if (!data.receiverId || !data.content) {
      return;
    }

    try {
      const message = await this.chatService.saveMessage(senderId, data.receiverId, data.content);
      
      // Dispatch real-time message payload to receiver's private room
      this.server.to(data.receiverId).emit('message', message);
      
      // Echo confirmation payload back to the sender client
      socket.emit('messageSent', message);
    } catch (error: any) {
      console.error('Error handling sendMessage WebSocket event:', error.message);
      socket.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { receiverId: string; isTyping: boolean },
  ) {
    const senderId = this.socketToProfile.get(socket.id);
    if (!senderId) return;

    if (!data.receiverId) return;

    // Send typing notification payload to receiver
    this.server.to(data.receiverId).emit('typing', {
      senderId,
      isTyping: data.isTyping,
    });
  }
}
