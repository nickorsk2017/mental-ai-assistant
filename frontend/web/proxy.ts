import { type NextRequest, NextResponse } from 'next/server';

type SessionUser = {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
};

async function fetchSessionUser(accessToken: string): Promise<SessionUser | null> {
  const backendUrl = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000';

  try {
    const response = await fetch(`${backendUrl}/auth/session`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {return null;}

    const body = (await response.json()) as { success: boolean; data: SessionUser };

    return body.success ? body.data : null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPath = pathname === '/auth' || pathname.startsWith('/auth/');
  const accessToken = request.cookies.get('accessToken')?.value;

  const requestHeaders = new Headers(request.headers);

  requestHeaders.set('x-pathname', pathname);

  if (!accessToken) {
    if (!isPublicPath) {return NextResponse.redirect(new URL('/auth', request.url));}

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const user = await fetchSessionUser(accessToken);

  if (!user && !isPublicPath) {return NextResponse.redirect(new URL('/auth', request.url));}

  if (user && isPublicPath) {return NextResponse.redirect(new URL('/dashboard', request.url));}

  if (user) {requestHeaders.set('x-user', JSON.stringify(user));}

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export default proxy;

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
