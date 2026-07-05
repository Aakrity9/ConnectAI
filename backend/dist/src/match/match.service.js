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
exports.MatchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_service_1 = require("../ai/ai.service");
let MatchService = class MatchService {
    prisma;
    aiService;
    constructor(prisma, aiService) {
        this.prisma = prisma;
        this.aiService = aiService;
    }
    async getMatchesForUser(clerkId) {
        const user = await this.prisma.user.findUnique({
            where: { clerkId },
            include: { profile: true },
        });
        if (!user || !user.profile) {
            throw new common_1.NotFoundException('User profile not found');
        }
        const activeProfile = user.profile;
        const rawVector = await this.prisma.$queryRawUnsafe(`
      SELECT "embedding"::text FROM "Profile" WHERE "id" = '${activeProfile.id}'
    `);
        let embeddingText = rawVector[0]?.embedding;
        if (!embeddingText) {
            try {
                console.log('Embedding not found. Syncing profile embedding...');
                const skillsText = (activeProfile.skills || []).join(', ');
                const interestsText = (activeProfile.interests || []).join(', ');
                const goalsText = (activeProfile.careerGoals || []).join(', ');
                const lookingText = (activeProfile.lookingFor || []).join(', ');
                const semanticText = `Attendee Name: ${activeProfile.name || ''}. ` +
                    `Experience: ${activeProfile.experience || ''}. ` +
                    `Skills: ${skillsText}. ` +
                    `Interests: ${interestsText}. ` +
                    `Career Goals: ${goalsText}. ` +
                    `Looking For: ${lookingText}. ` +
                    `Startup Interest: ${activeProfile.startupInterest ? 'Yes' : 'No'}. ` +
                    `Hackathon Interest: ${activeProfile.hackathonInterest ? 'Yes' : 'No'}.`;
                const embedding = await this.aiService.getEmbedding(semanticText);
                embeddingText = `[${embedding.join(',')}]`;
                await this.prisma.$executeRawUnsafe(`UPDATE "Profile" SET "embedding" = '${embeddingText}'::vector WHERE "id" = '${activeProfile.id}'`);
            }
            catch (err) {
                throw new common_1.BadRequestException(`Please complete your profile to generate matchmaking recommendations: ${err.message}`);
            }
        }
        const matchedProfiles = await this.prisma.$queryRawUnsafe(`
      SELECT p.id, p."userId", p."name", p."photo", p."college", p."company", p."degree", p."experience", p."skills", p."interests", p."careerGoals", p."lookingFor",
             (1 - (p.embedding <=> '${embeddingText}'::vector)) * 100 AS "matchPercentage"
      FROM "Profile" p
      WHERE p.id != '${activeProfile.id}' AND p.embedding IS NOT NULL
      ORDER BY p.embedding <=> '${embeddingText}'::vector ASC
      LIMIT 5
    `);
        const results = [];
        for (const match of matchedProfiles) {
            let explanation = 'You have complementary interests and skills.';
            let icebreakers = ['What project are you hacking on today?'];
            try {
                const [expRes, iceRes] = await Promise.all([
                    this.aiService.explainMatch(activeProfile, match),
                    this.aiService.generateIcebreakers(activeProfile, match),
                ]);
                explanation = expRes;
                icebreakers = iceRes;
            }
            catch (error) {
                console.error(`AI match generation failed for match ${match.id}:`, error.message);
            }
            results.push({
                profile: {
                    id: match.id,
                    name: match.name,
                    photo: match.photo,
                    college: match.college,
                    company: match.company,
                    degree: match.degree,
                    experience: match.experience,
                    skills: match.skills,
                    interests: match.interests,
                    careerGoals: match.careerGoals,
                    lookingFor: match.lookingFor,
                },
                matchPercentage: Math.round(match.matchPercentage || 0),
                explanation,
                icebreakers,
            });
        }
        return results;
    }
};
exports.MatchService = MatchService;
exports.MatchService = MatchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AiService])
], MatchService);
//# sourceMappingURL=match.service.js.map