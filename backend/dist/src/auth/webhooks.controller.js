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
exports.WebhooksController = void 0;
const common_1 = require("@nestjs/common");
const svix_1 = require("svix");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
let WebhooksController = class WebhooksController {
    configService;
    prisma;
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
    }
    async handleClerkWebhook(svixId, svixTimestamp, svixSignature, req, res) {
        const webhookSecret = this.configService.get('CLERK_WEBHOOK_SECRET');
        if (!webhookSecret) {
            console.error('CLERK_WEBHOOK_SECRET is not configured');
            return res.status(500).json({ error: 'Webhook secret is not configured' });
        }
        if (!svixId || !svixTimestamp || !svixSignature) {
            throw new common_1.BadRequestException('Missing svix headers');
        }
        const payload = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);
        const headers = {
            'svix-id': svixId,
            'svix-timestamp': svixTimestamp,
            'svix-signature': svixSignature,
        };
        const wh = new svix_1.Webhook(webhookSecret);
        let evt;
        try {
            evt = wh.verify(payload, headers);
        }
        catch (err) {
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
        }
        else if (type === 'user.updated') {
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
        }
        else if (type === 'user.deleted') {
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
};
exports.WebhooksController = WebhooksController;
__decorate([
    (0, common_1.Post)('clerk'),
    __param(0, (0, common_1.Headers)('svix-id')),
    __param(1, (0, common_1.Headers)('svix-timestamp')),
    __param(2, (0, common_1.Headers)('svix-signature')),
    __param(3, (0, common_1.Req)()),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "handleClerkWebhook", null);
exports.WebhooksController = WebhooksController = __decorate([
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], WebhooksController);
//# sourceMappingURL=webhooks.controller.js.map