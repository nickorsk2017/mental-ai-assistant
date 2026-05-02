'use client';

import React, { useCallback, useState } from 'react';
import { AuthSignInFields } from './components/AuthSignInFields';
import { AuthSignUpFields } from './components/AuthSignUpFields';
import { Button } from '../../atoms/Button/Button';

type AuthMode = 'sign-in' | 'sign-up';

interface AuthFormProps {
  containerClassName?: string;
}

export const AuthForm = React.memo(function AuthForm({
  containerClassName,
}: AuthFormProps) {
  const [currentMode, setCurrentMode] = useState<AuthMode>('sign-in');
  const isSignInMode = currentMode === 'sign-in';

  const showSignInForm = useCallback(() => setCurrentMode('sign-in'), []);
  const showSignUpForm = useCallback(() => setCurrentMode('sign-up'), []);

  const rootClassName = containerClassName
    ? `relative flex flex-col w-full max-w-[640px] overflow-hidden h-full md:h-auto ${containerClassName}`
    : 'relative flex flex-col bg-calm-surface rounded-lg w-full max-w-[640px] overflow-hidden h-full md:h-auto';

  return (
    <div className={rootClassName}>
      <div className="border-b border-calm-border/45 px-10 pb-4 pt-10 backdrop-blur-[2px]">
        <h1 className="text-3xl font-bold text-calm-text">{isSignInMode ? 'SIGN IN' : 'SIGN UP'}</h1>
        <div className="mt-4 flex flex-col items-center justify-between gap-3 md:flex-row">
          <span className="w-full text-calm-muted md:w-auto">{isSignInMode ? "Login to your account" : "Create new account"}</span>
          <div className="mt-4 flex items-center gap-3 md:mt-0">
            <Button variant="ghost" size="small" wide={false} onClick={showSignInForm} className={isSignInMode ? 'text-calm-second underline' : 'text-calm-muted'}>
              Sign In
            </Button>
            <span className="text-calm-muted">|</span>
            <Button variant="ghost" size="small" wide={false} onClick={showSignUpForm} className={!isSignInMode ? 'text-calm-second underline' : 'text-calm-muted'}>
              Sign Up
            </Button>
          </div>
        </div>
      </div>
      <div className="px-10 py-8">{currentMode === 'sign-in' ? <AuthSignInFields /> : <AuthSignUpFields onSignedUp={showSignInForm} />}</div>
    </div>
  );
});
