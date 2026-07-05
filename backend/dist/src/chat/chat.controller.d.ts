import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getHistory(req: any, contactId: string, limit?: number, offset?: number): Promise<({
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
        receiver: {
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
        senderId: string;
        receiverId: string;
        content: string;
    })[]>;
}
