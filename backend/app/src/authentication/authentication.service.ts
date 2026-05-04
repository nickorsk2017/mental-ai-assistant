import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../providers';

@Injectable()
export class AuthenticationService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async signIn(
    credentials: Entity.SignInCredentials,
  ): Promise<Entity.ApiResponse<Entity.AuthenticationResponse>> {
    const { data, error } = await this.supabaseService.authClient.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error || !data.session || !data.user) {
      return {
        success: false,
        data: null,
        error: error?.message ?? 'Sign in failed',
      };
    }

    return {
      success: true,
      data: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at ?? 0,
        user: {
          id: data.user.id,
          email: data.user.email ?? '',
          displayName: data.user.user_metadata?.['display_name'] ?? '',
          createdAt: data.user.created_at,
        },
      },
      error: null,
    };
  }

  async signUp(credentials: Entity.SignUpCredentials): Promise<Entity.ApiResponse<{ userId: string }>> {
    const { data, error } = await this.supabaseService.authClient.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: { data: { display_name: credentials.displayName } },
    });

    if (error || !data.user) {
      return {
        success: false,
        data: null,
        error: error?.message ?? 'Sign up failed',
      };
    }

    return { success: true, data: { userId: data.user.id }, error: null };
  }

  async getSession(accessToken: string): Promise<Entity.ApiResponse<Entity.AuthenticationUserProfile>> {
    const { data, error } = await this.supabaseService.adminClient.auth.getUser(accessToken);

    if (error || !data.user) {
      return {
        success: false,
        data: null,
        error: error?.message ?? 'Invalid or expired session',
      };
    }

    return {
      success: true,
      data: {
        id: data.user.id,
        email: data.user.email ?? '',
        displayName: data.user.user_metadata?.['display_name'] ?? '',
        createdAt: data.user.created_at,
      },
      error: null,
    };
  }

  async refreshSession(
    payload: Entity.RefreshTokenPayload,
  ): Promise<Entity.ApiResponse<Entity.AuthenticationResponse>> {
    const { data, error } = await this.supabaseService.authClient.auth.refreshSession({
      refresh_token: payload.refreshToken,
    });

    if (error || !data.session || !data.user) {
      return {
        success: false,
        data: null,
        error: error?.message ?? 'Session refresh failed',
      };
    }

    return {
      success: true,
      data: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at ?? 0,
        user: {
          id: data.user.id,
          email: data.user.email ?? '',
          displayName: data.user.user_metadata?.['display_name'] ?? '',
          createdAt: data.user.created_at,
        },
      },
      error: null,
    };
  }

  async signOut(accessToken: string): Promise<Entity.ApiResponse<null>> {
    const { error } = await this.supabaseService.adminClient.auth.admin.signOut(accessToken);

    if (error) {
      return { success: false, data: null as null, error: error.message };
    }

    return { success: true, data: null, error: null };
  }
}
