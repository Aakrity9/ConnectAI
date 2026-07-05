import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { ProfileService } from './profile.service';

@Controller('api/profile')
@UseGuards(ClerkAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@Req() req: any) {
    const clerkId = req.user.sub;
    return this.profileService.getProfileByClerkId(clerkId);
  }

  @Put()
  async updateProfile(@Req() req: any, @Body() body: any) {
    const clerkId = req.user.sub;
    return this.profileService.updateProfileByClerkId(clerkId, body);
  }
}
