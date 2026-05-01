export {};

declare global {
  namespace Entity {
    interface ApiResponse<DataType> {
      success: boolean;
      data: DataType;
      error: string | null;
    }

    interface SignInCredentials {
      email: string;
      password: string;
    }

    interface SignUpCredentials {
      email: string;
      password: string;
      displayName: string;
    }

    interface RefreshTokenPayload {
      refreshToken: string;
    }

    interface AuthenticationTokens {
      accessToken: string;
      refreshToken: string;
      expiresAt: number;
    }

    interface AuthenticationUserProfile {
      id: string;
      email: string;
      displayName: string;
      createdAt: string;
    }

    interface AuthenticationResponse extends AuthenticationTokens {
      user: AuthenticationUserProfile;
    }
  }
}
