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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ConnectionService = class ConnectionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sendRequest(senderClerkId, receiverId) {
        const senderUser = await this.prisma.user.findUnique({
            where: { clerkId: senderClerkId },
            include: { profile: true },
        });
        if (!senderUser || !senderUser.profile) {
            throw new common_1.NotFoundException('Sender profile not found');
        }
        const receiver = await this.prisma.profile.findUnique({
            where: { id: receiverId },
        });
        if (!receiver) {
            throw new common_1.NotFoundException('Receiver profile not found');
        }
        if (senderUser.profile.id === receiverId) {
            throw new common_1.BadRequestException('You cannot connect with yourself');
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
            throw new common_1.BadRequestException('Connection request already exists or you are already connected');
        }
        return this.prisma.connectionRequest.create({
            data: {
                senderId: senderUser.profile.id,
                receiverId,
                status: 'PENDING',
            },
        });
    }
    async respondToRequest(clerkId, requestId, status) {
        const user = await this.prisma.user.findUnique({
            where: { clerkId },
            include: { profile: true },
        });
        if (!user || !user.profile) {
            throw new common_1.NotFoundException('User profile not found');
        }
        const request = await this.prisma.connectionRequest.findUnique({
            where: { id: requestId },
        });
        if (!request) {
            throw new common_1.NotFoundException('Connection request not found');
        }
        if (request.receiverId !== user.profile.id) {
            throw new common_1.BadRequestException('You are not authorized to respond to this request');
        }
        return this.prisma.connectionRequest.update({
            where: { id: requestId },
            data: { status },
        });
    }
    async getPendingRequests(clerkId) {
        const user = await this.prisma.user.findUnique({
            where: { clerkId },
            include: { profile: true },
        });
        if (!user || !user.profile) {
            throw new common_1.NotFoundException('User profile not found');
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
    async getConnectionsList(clerkId) {
        const user = await this.prisma.user.findUnique({
            where: { clerkId },
            include: { profile: true },
        });
        if (!user || !user.profile) {
            throw new common_1.NotFoundException('User profile not found');
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
};
exports.ConnectionService = ConnectionService;
exports.ConnectionService = ConnectionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConnectionService);
//# sourceMappingURL=connection.service.js.map