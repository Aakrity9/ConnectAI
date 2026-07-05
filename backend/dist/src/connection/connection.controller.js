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
exports.ConnectionController = void 0;
const common_1 = require("@nestjs/common");
const clerk_auth_guard_1 = require("../auth/clerk-auth.guard");
const connection_service_1 = require("./connection.service");
let ConnectionController = class ConnectionController {
    connectionService;
    constructor(connectionService) {
        this.connectionService = connectionService;
    }
    async sendRequest(req, receiverId) {
        const senderClerkId = req.user.sub;
        return this.connectionService.sendRequest(senderClerkId, receiverId);
    }
    async respondToRequest(req, requestId, status) {
        const clerkId = req.user.sub;
        return this.connectionService.respondToRequest(clerkId, requestId, status);
    }
    async getPendingRequests(req) {
        const clerkId = req.user.sub;
        return this.connectionService.getPendingRequests(clerkId);
    }
    async getConnectionsList(req) {
        const clerkId = req.user.sub;
        return this.connectionService.getConnectionsList(clerkId);
    }
};
exports.ConnectionController = ConnectionController;
__decorate([
    (0, common_1.Post)('request'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('receiverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ConnectionController.prototype, "sendRequest", null);
__decorate([
    (0, common_1.Put)('request/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ConnectionController.prototype, "respondToRequest", null);
__decorate([
    (0, common_1.Get)('pending'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConnectionController.prototype, "getPendingRequests", null);
__decorate([
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConnectionController.prototype, "getConnectionsList", null);
exports.ConnectionController = ConnectionController = __decorate([
    (0, common_1.Controller)('api/connections'),
    (0, common_1.UseGuards)(clerk_auth_guard_1.ClerkAuthGuard),
    __metadata("design:paramtypes", [connection_service_1.ConnectionService])
], ConnectionController);
//# sourceMappingURL=connection.controller.js.map