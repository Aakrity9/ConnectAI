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
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_service_1 = require("../ai/ai.service");
let ProfileService = class ProfileService {
    prisma;
    aiService;
    constructor(prisma, aiService) {
        this.prisma = prisma;
        this.aiService = aiService;
    }
    async getProfileByClerkId(clerkId) {
        const user = await this.prisma.user.findUnique({
            where: { clerkId },
            include: { profile: true },
        });
        if (!user || !user.profile) {
            throw new common_1.NotFoundException('User profile not found');
        }
        return user.profile;
    }
    async updateProfileByClerkId(clerkId, data) {
        const user = await this.prisma.user.findUnique({
            where: { clerkId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User record not found');
        }
        const { id, userId, embedding, createdAt, updatedAt, ...updatableData } = data;
        const updatedProfile = await this.prisma.profile.update({
            where: { userId: user.id },
            data: updatableData,
        });
        try {
            await this.syncProfileEmbedding(updatedProfile.id);
        }
        catch (error) {
            console.error(`Failed to generate profile embedding for profile ${updatedProfile.id}:`, error.message);
        }
        return this.prisma.profile.findUnique({
            where: { id: updatedProfile.id },
        });
    }
    async syncProfileEmbedding(profileId) {
        const profile = await this.prisma.profile.findUnique({
            where: { id: profileId },
        });
        if (!profile)
            return;
        const skillsText = (profile.skills || []).join(', ');
        const interestsText = (profile.interests || []).join(', ');
        const goalsText = (profile.careerGoals || []).join(', ');
        const lookingText = (profile.lookingFor || []).join(', ');
        const semanticText = `Attendee Name: ${profile.name || ''}. ` +
            `Experience: ${profile.experience || ''}. ` +
            `Skills: ${skillsText}. ` +
            `Interests: ${interestsText}. ` +
            `Career Goals: ${goalsText}. ` +
            `Looking For: ${lookingText}. ` +
            `Startup Interest: ${profile.startupInterest ? 'Yes' : 'No'}. ` +
            `Hackathon Interest: ${profile.hackathonInterest ? 'Yes' : 'No'}.`;
        const embedding = await this.aiService.getEmbedding(semanticText);
        const vectorString = `[${embedding.join(',')}]`;
        await this.prisma.$executeRawUnsafe(`UPDATE "Profile" SET "embedding" = '${vectorString}'::vector WHERE "id" = '${profileId}'`);
        console.log(`Successfully generated and saved vector embedding for profile: ${profile.name}`);
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AiService])
], ProfileService);
//# sourceMappingURL=profile.service.js.map