import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { verifyToken } from '@clerk/backend';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('No authorization token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid authorization token format');
    }

    const secretKey = this.configService.get<string>('CLERK_SECRET_KEY');

    // Mock Mode Fallback when Clerk environment keys are missing or mock tokens are used
    if (!secretKey || secretKey === 'mock' || token.startsWith('mock-')) {
      request.user = {
        sub: token.startsWith('mock-') ? token : 'mock-user-123',
        userId: token.startsWith('mock-') ? token : 'mock-user-123',
        email: 'ananya@example.com',
      };
      return true;
    }

    try {
      const verified = await verifyToken(token, { secretKey });
      request.user = verified;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired authentication token');
    }
  }
}
