import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { ChatService } from './chat.service';

@Controller('api/chat')
@UseGuards(ClerkAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':contactId')
  async getHistory(
    @Req() req: any,
    @Param('contactId') contactId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const clerkId = req.user.sub;
    return this.chatService.getConversationHistory(clerkId, contactId, limit || 50, offset || 0);
  }
}
