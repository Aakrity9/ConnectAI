import { MatchService } from './match.service';
export declare class MatchController {
    private readonly matchService;
    constructor(matchService: MatchService);
    getMatches(req: any): Promise<{
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
