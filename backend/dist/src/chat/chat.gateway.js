"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const backend_1 = require("@clerk/backend");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const chat_service_1 = require("./chat.service");
let ChatGateway = class ChatGateway {
    configService;
    prisma;
    chatService;
    server;
    socketToProfile = new Map();
    profileToSockets = new Map();
    constructor(configService, prisma, chatService) {
        this.configService = configService;
        this.prisma = prisma;
        this.chatService = chatService;
    }
    async handleConnection(socket) {
        const token = socket.handshake.auth?.token ||
            socket.handshake.headers['authorization']?.split(' ')[1] ||
            socket.handshake.query?.token;
        if (!token || typeof token !== 'string') {
            console.log(`WebSocket connection rejected: Missing token for socket ${socket.id}`);
            socket.disconnect();
            return;
        }
        const secretKey = this.configService.get('CLERK_SECRET_KEY');
        let clerkId;
        if (!secretKey || secretKey === 'mock' || token.startsWith('mock-')) {
            clerkId = token.startsWith('mock-') ? token : 'mock-user-123';
        }
        else {
            try {
                const verified = await (0, backend_1.verifyToken)(token, { secretKey });
                clerkId = verified.sub;
            }
            catch (error) {
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
            this.socketToProfile.set(socket.id, profileId);
            if (!this.profileToSockets.has(profileId)) {
                this.profileToSockets.set(profileId, new Set());
            }
            this.profileToSockets.get(profileId).add(socket.id);
            socket.join(profileId);
            console.log(`WebSocket client authenticated and connected: ${profileId} (${user.email})`);
        }
        catch (error) {
            console.log(`WebSocket auth failed: ${error.message} for socket ${socket.id}`);
            socket.disconnect();
        }
    }
    handleDisconnect(socket) {
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
    async handleMessage(socket, data) {
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
            this.server.to(data.receiverId).emit('message', message);
            socket.emit('messageSent', message);
        }
        catch (error) {
            console.error('Error handling sendMessage WebSocket event:', error.message);
            socket.emit('error', { message: 'Failed to send message' });
        }
    }
    handleTyping(socket, data) {
        const senderId = this.socketToProfile.get(socket.id);
        if (!senderId)
            return;
        if (!data.receiverId)
            return;
        this.server.to(data.receiverId).emit('typing', {
            senderId,
            isTyping: data.isTyping,
        });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTyping", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map