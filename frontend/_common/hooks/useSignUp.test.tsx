import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { useSignUp } from './useSignUp';

type SignUpResponse = Promise<{ success: boolean; data: unknown; error: string | null }>;

describe('useSignUp', () => {
  const signUpMock: jest.Mock = jest.fn();

  const signUpServiceClient = {
    signUp: signUpMock as (
      emailAddress: string,
      password: string,
      displayName: string,
    ) => SignUpResponse,
  };

  beforeEach(() => {
    signUpMock.mockReset();
  });

  it('calls client signUp with form field values', async () => {
    signUpMock.mockImplementation(async () => ({
      success: true,
      data: { userId: 'new-user' },
      error: null,
    }));

    const { result } = renderHook(() => useSignUp(signUpServiceClient));

    let response: { success: boolean; data: unknown; error: string | null } | undefined;
    await act(async () => {
      response = await result.current.signUp({
        emailAddress: 'hello@example.com',
        password: 'secret-value',
        displayName: 'Hello User',
      });
    });

    expect(signUpMock).toHaveBeenCalledTimes(1);
    expect(signUpMock).toHaveBeenCalledWith('hello@example.com', 'secret-value', 'Hello User');
    expect(response).toEqual({
      success: true,
      data: { userId: 'new-user' },
      error: null,
    });
  });

  it('returns client error response without changing arguments', async () => {
    signUpMock.mockImplementation(async () => ({
      success: false,
      data: null,
      error: 'Email already registered.',
    }));

    const { result } = renderHook(() => useSignUp(signUpServiceClient));

    let response: { success: boolean; data: unknown; error: string | null } | undefined;
    await act(async () => {
      response = await result.current.signUp({
        emailAddress: 'dup@example.com',
        password: 'p',
        displayName: 'Dup',
      });
    });

    expect(response?.success).toBe(false);
    expect(response?.error).toBe('Email already registered.');
  });
});
