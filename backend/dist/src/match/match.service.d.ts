import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
export declare class MatchService {
    private prisma;
    private aiService;
    constructor(prisma: PrismaService, aiService: AiService);
    getMatchesForUser(clerkId: string): Promise<{
        profile: {
            id: any;
            name: any;
            photo: any;
            college: any;
            company: any;
            degree: any;
            experience: any;
            skills: any;
            interests: any;
            careerGoals: any;
            lookingFor: any;
        };
        matchPercentage: number;
        explanation: string;
        icebreakers: string[];
    }[]>;
}
