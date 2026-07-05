import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async getProfileByClerkId(clerkId: string) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      throw new NotFoundException('User profile not found');
    }

    return user.profile;
  }

  async updateProfileByClerkId(clerkId: string, data: any) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new NotFoundException('User record not found');
    }

    const { id, userId, embedding, createdAt, updatedAt, ...updatableData } = data;

    const updatedProfile = await this.prisma.profile.update({
      where: { userId: user.id },
      data: updatableData,
    });

    try {
      await this.syncProfileEmbedding(updatedProfile.id);
    } catch (error: any) {
      console.error(`Failed to generate profile embedding for profile ${updatedProfile.id}:`, error.message);
    }

    return this.prisma.profile.findUnique({
      where: { id: updatedProfile.id },
    });
  }

  async syncProfileEmbedding(profileId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) return;

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

    await this.prisma.$executeRawUnsafe(
      `UPDATE "Profile" SET "embedding" = '${vectorString}'::vector WHERE "id" = '${profileId}'`
    );
    console.log(`Successfully generated and saved vector embedding for profile: ${profile.name}`);
  }
}
