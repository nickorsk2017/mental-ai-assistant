import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SupabaseService } from '../providers/supabase/supabase.service';

@Injectable()
export class SupabaseAuthenticationGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorizationHeader = request.headers.authorization;
    const cookieAccessToken =
      typeof request.cookies === 'object' && request.cookies !== null
        ? (request.cookies as Record<string, string>).accessToken
        : undefined;

    let token = '';
    if (authorizationHeader?.startsWith('Bearer ')) {
      token = authorizationHeader.slice(7);
    } else if (cookieAccessToken) {
      token = cookieAccessToken;
    }

    if (!token) {
      throw new UnauthorizedException('Missing or invalid authorization');
    }
    const { data, error } = await this.supabaseService.adminClient.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    request.headers['x-user-id'] = data.user.id;
    request.headers['x-user-email'] = data.user.email ?? '';

    return true;
  }
}
