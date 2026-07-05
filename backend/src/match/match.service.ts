import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class MatchService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async getMatchesForUser(clerkId: string) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      throw new NotFoundException('User profile not found');
    }

    const activeProfile = user.profile;

    const rawVector: any[] = await this.prisma.$queryRawUnsafe(`
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
        
        await this.prisma.$executeRawUnsafe(
          `UPDATE "Profile" SET "embedding" = '${embeddingText}'::vector WHERE "id" = '${activeProfile.id}'`
        );
      } catch (err: any) {
        throw new BadRequestException(`Please complete your profile to generate matchmaking recommendations: ${err.message}`);
      }
    }

    const matchedProfiles: any[] = await this.prisma.$queryRawUnsafe(`
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
      } catch (error: any) {
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
}
