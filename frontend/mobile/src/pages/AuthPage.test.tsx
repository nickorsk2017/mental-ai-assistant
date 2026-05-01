import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthPage } from './AuthPage';

jest.mock('@ionic/react', () => ({
  IonPage: ({ children }: { children: React.ReactNode }) => <div data-testid="ion-page">{children}</div>,
  IonContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="ion-content">{children}</div>
  ),
}));

jest.mock('@common/shared/ui-kit', () => ({
  AuthForm: () => <div data-testid="auth-form">Auth form</div>,
}));

describe('mobile AuthPage', () => {
  it('renders AuthForm inside ionic containers', () => {
    render(<AuthPage />);

    expect(screen.getByTestId('ion-page')).toBeTruthy();
    expect(screen.getByTestId('ion-content')).toBeTruthy();
    expect(screen.getByTestId('auth-form')).toBeTruthy();
  });
});
