import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ApiKeysService } from '../../api-keys/api-keys.service';

@Injectable()
export class FlexibleAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private apiKeysService: ApiKeysService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    const apiKey = request.headers['x-api-key'];
    if (apiKey) {
      try {
        const user = await this.apiKeysService.validateApiKey(apiKey);
        request.user = user;
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid or expired API key');
      }
    }

    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('JWT_SECRET'),
        });
        request.user = { userId: payload.sub, email: payload.email, type: 'user' };
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }

    throw new UnauthorizedException('Authentication required (Bearer token or API key)');
  }
}
