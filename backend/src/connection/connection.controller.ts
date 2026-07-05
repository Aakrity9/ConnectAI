import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { ConnectionService } from './connection.service';

@Controller('api/connections')
@UseGuards(ClerkAuthGuard)
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Post('request')
  async sendRequest(@Req() req: any, @Body('receiverId') receiverId: string) {
    const senderClerkId = req.user.sub;
    return this.connectionService.sendRequest(senderClerkId, receiverId);
  }

  @Put('request/:id')
  async respondToRequest(
    @Req() req: any,
    @Param('id') requestId: string,
    @Body('status') status: 'ACCEPTED' | 'DECLINED',
  ) {
    const clerkId = req.user.sub;
    return this.connectionService.respondToRequest(clerkId, requestId, status);
  }

  @Get('pending')
  async getPendingRequests(@Req() req: any) {
    const clerkId = req.user.sub;
    return this.connectionService.getPendingRequests(clerkId);
  }

  @Get('list')
  async getConnectionsList(@Req() req: any) {
    const clerkId = req.user.sub;
    return this.connectionService.getConnectionsList(clerkId);
  }
}
