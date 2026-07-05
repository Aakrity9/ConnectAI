import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { MatchService } from './match.service';

@Controller('api/matches')
@UseGuards(ClerkAuthGuard)
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  async getMatches(@Req() req: any) {
    const clerkId = req.user.sub;
    return this.matchService.getMatchesForUser(clerkId);
  }
}
