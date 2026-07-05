import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ChatService } from './chat.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private configService;
    private prisma;
    private chatService;
    server: Server;
    private socketToProfile;
    private profileToSockets;
    constructor(configService: ConfigService, prisma: PrismaService, chatService: ChatService);
    handleConnection(socket: Socket): Promise<void>;
    handleDisconnect(socket: Socket): void;
    handleMessage(socket: Socket, data: {
        receiverId: string;
        content: string;
    }): Promise<void>;
    handleTyping(socket: Socket, data: {
        receiverId: string;
        isTyping: boolean;
    }): void;
}
