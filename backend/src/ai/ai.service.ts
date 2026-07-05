import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private aiServiceUrl: string;

  constructor(private configService: ConfigService) {
    this.aiServiceUrl = this.configService.get<string>('AI_SERVICE_URL') || 'http://localhost:8000';
  }

  async getEmbedding(text: string): Promise<number[]> {
    const response = await fetch(`${this.aiServiceUrl}/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI Service /embeddings failed: ${errorText}`);
    }

    const data: any = await response.json();
    return data.embedding;
  }

  async explainMatch(profile1: any, profile2: any): Promise<string> {
    const response = await fetch(`${this.aiServiceUrl}/explain-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile1, profile2 }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI Service /explain-match failed: ${errorText}`);
    }

    const data: any = await response.json();
    return data.explanation;
  }

  async generateIcebreakers(profile1: any, profile2: any): Promise<string[]> {
    const response = await fetch(`${this.aiServiceUrl}/generate-icebreakers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile1, profile2 }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI Service /generate-icebreakers failed: ${errorText}`);
    }

    const data: any = await response.json();
    return data.icebreakers;
  }
}
