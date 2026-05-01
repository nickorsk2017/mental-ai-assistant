import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../providers';
import {
  ServiceResponse,
  buildSuccessResponse,
  buildErrorResponse,
} from '../utils/response.builder';

@Injectable()
export class AuthenticationService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async signIn(
    credentials: Entity.SignInCredentials,
  ): Promise<ServiceResponse<Entity.AuthenticationResponse>> {
    const { data, error } = await this.supabaseService.authClient.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error || !data.session || !data.user) {
      return buildErrorResponse(error?.message ?? 'Sign in failed');
    }

    return buildSuccessResponse({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at ?? 0,
      user: {
        id: data.user.id,
        email: data.user.email ?? '',
        displayName: data.user.user_metadata?.['display_name'] ?? '',
        createdAt: data.user.created_at,
      },
    });
  }

  async signUp(credentials: Entity.SignUpCredentials): Promise<ServiceResponse<{ userId: string }>> {
    const { data, error } = await this.supabaseService.authClient.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: { data: { display_name: credentials.displayName } },
    });

    if (error || !data.user) {
      return buildErrorResponse(error?.message ?? 'Sign up failed');
    }

    return buildSuccessResponse({ userId: data.user.id });
  }

  async getSession(accessToken: string): Promise<ServiceResponse<Entity.AuthenticationUserProfile>> {
    const { data, error } = await this.supabaseService.adminClient.auth.getUser(accessToken);

    if (error || !data.user) {
      return buildErrorResponse(error?.message ?? 'Invalid or expired session');
    }

    return buildSuccessResponse({
      id: data.user.id,
      email: data.user.email ?? '',
      displayName: data.user.user_metadata?.['display_name'] ?? '',
      createdAt: data.user.created_at,
    });
  }

  async refreshSession(
    payload: Entity.RefreshTokenPayload,
  ): Promise<ServiceResponse<Entity.AuthenticationResponse>> {
    const { data, error } = await this.supabaseService.authClient.auth.refreshSession({
      refresh_token: payload.refreshToken,
    });

    if (error || !data.session || !data.user) {
      return buildErrorResponse(error?.message ?? 'Session refresh failed');
    }

    return buildSuccessResponse({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at ?? 0,
      user: {
        id: data.user.id,
        email: data.user.email ?? '',
        displayName: data.user.user_metadata?.['display_name'] ?? '',
        createdAt: data.user.created_at,
      },
    });
  }

  async signOut(accessToken: string): Promise<ServiceResponse<null>> {
    const { error } = await this.supabaseService.adminClient.auth.admin.signOut(accessToken);

    if (error) {
      return buildErrorResponse(error.message);
    }

    return buildSuccessResponse(null);
  }
}
