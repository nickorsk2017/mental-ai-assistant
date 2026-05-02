import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

type CookieStore = {
  get: (name: string) => { value: string } | undefined;
};

type HeadersStore = {
  get: (name: string) => string | null;
};

const cookiesMock = jest.fn<() => Promise<CookieStore>>();
const headersMock = jest.fn<() => Promise<HeadersStore>>();
const redirectMock = jest.fn((destination: string) => {
  throw new Error(`REDIRECT:${destination}`);
});

jest.mock('next/headers', () => ({
  cookies: () => cookiesMock(),
  headers: () => headersMock(),
}));

jest.mock('next/navigation', () => ({
  redirect: (destination: string) => redirectMock(destination),
}));

function createCookieStore(accessToken?: string): CookieStore {
  return {
    get: (name: string) => (name === 'accessToken' && accessToken ? { value: accessToken } : undefined),
  };
}

function createHeadersStore(pathname: string): HeadersStore {
  return {
    get: (name: string) => (name === 'x-pathname' ? pathname : null),
  };
}

describe('getServerUser', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.resetModules();
    cookiesMock.mockReset();
    headersMock.mockReset();
    redirectMock.mockClear();
    delete process.env.BACKEND_URL;
    delete process.env.NEXT_PUBLIC_BACKEND_URL;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns null on public routes when no access token exists', async () => {
    cookiesMock.mockResolvedValue(createCookieStore());
    headersMock.mockResolvedValue(createHeadersStore('/auth'));

    const { getServerUser } = await import('./getServerUser');

    await expect(getServerUser()).resolves.toBeNull();
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it('redirects to auth on private routes when no access token exists', async () => {
    cookiesMock.mockResolvedValue(createCookieStore());
    headersMock.mockResolvedValue(createHeadersStore('/dashboard'));

    const { getServerUser } = await import('./getServerUser');

    await expect(getServerUser()).rejects.toThrow('REDIRECT:/auth');
    expect(redirectMock).toHaveBeenCalledWith('/auth');
  });

  it('returns the authenticated user when backend session lookup succeeds', async () => {
    cookiesMock.mockResolvedValue(createCookieStore('access-token'));
    headersMock.mockResolvedValue(createHeadersStore('/dashboard'));
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          id: 'u1',
          email: 'person@example.com',
          displayName: 'Person',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      }),
    })) as unknown as typeof fetch;

    const { getServerUser } = await import('./getServerUser');

    await expect(getServerUser()).resolves.toEqual({
      id: 'u1',
      email: 'person@example.com',
      displayName: 'Person',
      createdAt: '2024-01-01T00:00:00.000Z',
    });
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:4000/auth/session', {
      headers: { Authorization: 'Bearer access-token' },
      cache: 'no-store',
    });
  });

  it('redirects authenticated users away from public auth routes', async () => {
    cookiesMock.mockResolvedValue(createCookieStore('access-token'));
    headersMock.mockResolvedValue(createHeadersStore('/auth'));
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          id: 'u1',
          email: 'person@example.com',
          displayName: 'Person',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      }),
    })) as unknown as typeof fetch;

    const { getServerUser } = await import('./getServerUser');

    await expect(getServerUser()).rejects.toThrow('REDIRECT:/dashboard/chat');
    expect(redirectMock).toHaveBeenCalledWith('/dashboard/chat');
  });
});
