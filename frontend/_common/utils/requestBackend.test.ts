import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { requestBackend } from './requestBackend';

const fetchMock = jest.fn();

describe('requestBackend', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = fetchMock as unknown as typeof fetch;
    fetchMock.mockReset();
    delete process.env.NEXT_PUBLIC_BACKEND_URL;
    delete process.env.BACKEND_URL;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('calls fetch with default base URL when env is unset', async () => {
    fetchMock.mockImplementation(async () => ({
      ok: true,
      json: async () => ({ success: true, data: { id: 1 }, error: null }),
    }));

    await requestBackend<{ id: number }>('/auth/refresh', { method: 'POST' });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:4000/auth/refresh',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  it('prefers NEXT_PUBLIC_BACKEND_URL base', async () => {
    process.env.NEXT_PUBLIC_BACKEND_URL = 'http://custom.test';
    fetchMock.mockImplementation(async () => ({
      ok: true,
      json: async () => ({ success: true, data: null, error: null }),
    }));

    await requestBackend('/health', { method: 'GET' });

    expect(fetchMock).toHaveBeenCalledWith('http://custom.test/health', expect.any(Object));
  });

  it('includes Authorization header when accessToken passed', async () => {
    fetchMock.mockImplementation(async () => ({
      ok: true,
      json: async () => ({ success: true, data: null, error: null }),
    }));

    await requestBackend('/route', {
      method: 'POST',
      accessToken: 'token-value',
      body: { a: 1 },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token-value',
        },
        body: JSON.stringify({ a: 1 }),
      }),
    );
  });

  it('merges caller-provided headers into fetch request', async () => {
    fetchMock.mockImplementation(async () => ({
      ok: true,
      json: async () => ({ success: true, data: null, error: null }),
    }));

    await requestBackend('/route', {
      method: 'POST',
      headers: { 'x-client-platform': 'mobile' },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          'x-client-platform': 'mobile',
        },
      }),
    );
  });

  it('returns error envelope when response is not ok', async () => {
    fetchMock.mockImplementation(async () => ({
      ok: false,
      status: 502,
      json: async () => ({ success: false, data: null, error: 'Bad gateway' }),
    }));

    const result = await requestBackend('/bad', { method: 'GET' });

    expect(result).toEqual({
      success: false,
      data: null,
      error: 'Bad gateway',
    });
  });

  it('returns error envelope when parsed body has success false', async () => {
    fetchMock.mockImplementation(async () => ({
      ok: true,
      json: async () => ({ success: false, data: null, error: 'Not allowed' }),
    }));

    const result = await requestBackend('/x', { method: 'GET' });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Not allowed');
  });

  it('handles fetch throwing', async () => {
    fetchMock.mockImplementation(async () => {
      throw new Error('Network down');
    });

    const result = await requestBackend<unknown>('/y', { method: 'GET' });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network down');
  });
});
