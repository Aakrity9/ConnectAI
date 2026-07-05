import { PrismaService } from '../prisma/prisma.service';
export declare class ConnectionService {
    private prisma;
    constructor(prisma: PrismaService);
    sendRequest(senderClerkId: string, receiverId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ConnectionStatus;
        senderId: string;
        receiverId: string;
    }>;
    respondToRequest(clerkId: string, requestId: string, status: 'ACCEPTED' | 'DECLINED'): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ConnectionStatus;
        senderId: string;
        receiverId: string;
    }>;
    getPendingRequests(clerkId: string): Promise<({
        sender: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            photo: string | null;
            college: string | null;
            company: string | null;
            degree: string | null;
            experience: string | null;
            skills: string[];
            interests: string[];
            careerGoals: string[];
            startupInterest: boolean;
            hackathonInterest: boolean;
            lookingFor: string[];
            hobbies: string[];
            socialLinks: import("@prisma/client/runtime/client").JsonValue | null;
            portfolio: string | null;
            availability: string | null;
            attendingSolo: boolean;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ConnectionStatus;
        senderId: string;
        receiverId: string;
    })[]>;
    getConnectionsList(clerkId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        photo: string | null;
        college: string | null;
        company: string | null;
        degree: string | null;
        experience: string | null;
        skills: string[];
        interests: string[];
        careerGoals: string[];
        startupInterest: boolean;
        hackathonInterest: boolean;
        lookingFor: string[];
        hobbies: string[];
        socialLinks: import("@prisma/client/runtime/client").JsonValue | null;
        portfolio: string | null;
        availability: string | null;
        attendingSolo: boolean;
        userId: string;
    }[]>;
}
