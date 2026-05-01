import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { DashboardOrganism } from './DashboardOrganism';

const authenticationLogoutMock: jest.Mock = jest.fn(async () => true);

const authenticationInteractionSnapshot = {
  logout: authenticationLogoutMock as () => Promise<boolean>,
  isAuthenticating: false,
};

jest.mock('../../hooks', () => ({
  useAuthentication: () => authenticationInteractionSnapshot,
}));

jest.mock('../../stores/useAuthStore', () => ({
  useAuthenticationStore: (
    selector: (storeState: {
      currentUser: { email: string; displayName: string };
    }) => unknown,
  ) =>
    selector({
      currentUser: {
        email: 'viewer-holder@test.com',
        displayName: 'Viewer Holder',
      },
    }),
}));

describe('DashboardOrganism', () => {
  beforeEach(() => {
    authenticationInteractionSnapshot.isAuthenticating = false;
    authenticationLogoutMock.mockReset();
  });

  it('renders active user identifiers from store subscription', () => {
    authenticationInteractionSnapshot.isAuthenticating = false;
    render(<DashboardOrganism />);

    expect(screen.getByText('viewer-holder@test.com')).toBeTruthy();
    expect(screen.getByText('Viewer Holder')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sign Out' })).toBeTruthy();
  });

  it('notifies lifecycle callback once backend logout resolves true', async () => {
    const onSignedOutHandler = jest.fn();
    authenticationInteractionSnapshot.isAuthenticating = false;
    authenticationLogoutMock.mockImplementationOnce(async () => true);

    render(<DashboardOrganism onSignedOut={onSignedOutHandler} />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign Out' }));

    expect(authenticationLogoutMock).toHaveBeenCalledTimes(1);

    await waitFor(() => expect(onSignedOutHandler).toHaveBeenCalledTimes(1));
  });

  it('surfaces awaiting authentication label while logout flag active', () => {
    authenticationInteractionSnapshot.isAuthenticating = true;

    render(<DashboardOrganism />);

    expect(screen.getByRole('button', { name: 'Signing out...' })).toBeTruthy();
  });
});
