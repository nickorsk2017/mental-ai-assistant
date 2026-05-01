'use client';

import React, { useCallback, useState } from 'react';
import { AuthSignInFields } from './components/AuthSignInFields';
import { AuthSignUpFields } from './components/AuthSignUpFields';
import { Button } from '../../atoms/Button/Button';

type AuthMode = 'sign-in' | 'sign-up';

export const AuthForm = React.memo(function AuthForm() {
  const [currentMode, setCurrentMode] = useState<AuthMode>('sign-in');
  const isSignInMode = currentMode === 'sign-in';

  const showSignInForm = useCallback(() => setCurrentMode('sign-in'), []);
  const showSignUpForm = useCallback(() => setCurrentMode('sign-up'), []);

  return (
    <div className="relative flex flex-col bg-calm-surface rounded-lg w-full max-w-[640px] overflow-hidden h-full md:h-auto">
      <div className="px-10 pt-10 pb-4 border-b border-calm-border">
        <h1 className="text-3xl font-bold text-calm-text">{isSignInMode ? 'SIGN IN' : 'SIGN UP'}</h1>
        <div className="flex items-center justify-between gap-3 mt-4 flex-col md:flex-row">
          <span className="text-calm-muted w-full md:w-auto">{isSignInMode ? "Login to your account" : "Create new account"}</span>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button variant="ghost" size="small" wide={false} onClick={showSignInForm} className={isSignInMode ? 'text-calm-primary underline' : 'text-calm-muted'}>
              Sign In
            </Button>
            <span className="text-calm-muted">|</span>
            <Button variant="ghost" size="small" wide={false} onClick={showSignUpForm} className={!isSignInMode ? 'text-calm-primary underline' : 'text-calm-muted'}>
              Sign Up
            </Button>
          </div>
        </div>
      </div>
      <div className="px-10 py-8">{currentMode === 'sign-in' ? <AuthSignInFields /> : <AuthSignUpFields onSignedUp={showSignInForm} />}</div>
    </div>
  );
});
