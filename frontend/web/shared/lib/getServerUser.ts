import { cache } from 'react';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

export type ServerUser = {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
};

const PUBLIC_PATHS = ['/auth'];
const DEFAULT_BACKEND_URL = 'http://localhost:4000';

function redirectToAuth(): never {
  redirect('/auth');
}

export const getServerUser = cache(async (): Promise<ServerUser | null> => {
  const [cookieStore, headersList] = await Promise.all([cookies(), headers()]);
  const pathname = headersList.get('x-pathname') ?? '/';
  const accessToken = cookieStore.get('accessToken')?.value;
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  if (!accessToken) {
    if (!isPublicPath) {redirectToAuth();}

    return null;
  }

  const backendUrl = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? DEFAULT_BACKEND_URL;
  let user: ServerUser | null = null;

  try {
    const response = await fetch(`${backendUrl}/auth/session`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });

    if (response.ok) {
      const body = (await response.json()) as { success: boolean; data: ServerUser };

      user = body.success ? body.data : null;
    }
  } catch {
    user = null;
  }

  if (!user && !isPublicPath) {redirectToAuth();}

  if (user && isPublicPath) {redirect('/dashboard');}

  return user;
});

export async function requireServerUser(): Promise<ServerUser> {
  const user = await getServerUser();

  if (!user) {
    redirectToAuth();
  }

  return user;
}
