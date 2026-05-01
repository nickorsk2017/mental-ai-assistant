export {};

declare global {
  namespace Entity {
    interface User {
      id: string;
      email: string;
      displayName: string;
      avatarUrl?: string | null;
      createdAt: string;
      updatedAt?: string;
    }
  }
}
