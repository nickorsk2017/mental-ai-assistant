'use client';

import React, { useCallback, useState } from 'react';
import { AuthSignInFields } from './components/AuthSignInFields';
import { AuthSignUpFields } from './components/AuthSignUpFields';
import { Button } from '../../atoms/Button/Button';
import { cx } from '@common/shared/utils';
type AuthMode = 'sign-in' | 'sign-up';

interface AuthFormProps {
  className?: string;
}

export const AuthForm = React.memo(function AuthForm({
  className,
}: AuthFormProps) {
  const [currentMode, setCurrentMode] = useState<AuthMode>('sign-in');
  const isSignInMode = currentMode === 'sign-in';

  const showSignInForm = useCallback(() => setCurrentMode('sign-in'), []);
  const showSignUpForm = useCallback(() => setCurrentMode('sign-up'), []);


  return (
    <div className={cx("relative flex flex-col w-full max-w-[640px] overflow-hidden h-full md:h-auto", className)}>
      <div className="border-b border-calm-border/45 backdrop-blur-[2px]">
        <h1 className="text-3xl font-bold text-calm-text">{isSignInMode ? 'SIGN IN' : 'SIGN UP'}</h1>
        <div className="mt-4 flex flex-col items-center justify-between gap-3 md:flex-row">
          <span className="w-full text-calm-muted md:w-auto">{isSignInMode ? "Login to your account" : "Create new account"}</span>
          <div className="mt-4 flex items-center gap-3 md:mt-0">
            <Button variant="ghost" size="small" wide={false} onClick={showSignInForm} className={isSignInMode ? 'text-calm-black underline' : 'text-calm-muted'}>
              Sign In
            </Button>
            <span className="text-calm-muted">|</span>
            <Button variant="ghost" size="small" wide={false} onClick={showSignUpForm} className={!isSignInMode ? 'text-calm-black underline' : 'text-calm-muted'}>
              Sign Up
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        {currentMode === 'sign-in' ? <AuthSignInFields /> : <AuthSignUpFields onSignedUp={showSignInForm} />}
      </div>
    </div>
  );
});
