import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private configService;
    private aiServiceUrl;
    constructor(configService: ConfigService);
    getEmbedding(text: string): Promise<number[]>;
    explainMatch(profile1: any, profile2: any): Promise<string>;
    generateIcebreakers(profile1: any, profile2: any): Promise<string[]>;
}
