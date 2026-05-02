'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthenticationStore } from '@common/shared/stores/useAuthStore';
import { AuthForm } from '@common/shared/ui-kit';

import AuthPageBackgroundDecorations from './components/AuthPageBackgroundDecorations';

const authenticationFormGlassContainerClassName =
  'rounded-[28px] border border-calm-border/60 bg-calm-surface/50 shadow-subtle backdrop-blur-xl transition-all duration-300';

export default function AuthPage() {
  const router = useRouter();
  const currentUser = useAuthenticationStore((state) => state.currentUser);

  useEffect(() => {
    if (currentUser) {
      router.replace('/dashboard/chat');
    }
  }, [currentUser, router]);

  if (currentUser) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-calm-background">
      <AuthPageBackgroundDecorations />

      <header className="relative z-20 px-4 pt-5 sm:px-8 sm:pt-6">
        <Link
          href="/"
          className="inline-flex max-w-full flex-col rounded-[28px] border border-calm-border/60 bg-calm-surface/50 px-5 py-3 shadow-subtle backdrop-blur-xl transition-all duration-300 hover:border-calm-border/80 hover:shadow-medium"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-calm-second">Serene</span>
          <span className="text-sm text-calm-muted">AI-powered mental wellness journal</span>
        </Link>
      </header>

      <div className="relative z-10 flex min-h-[calc(100dvh-7rem)] items-center justify-center px-4 pb-12 pt-6 sm:px-6">
        <AuthForm containerClassName={authenticationFormGlassContainerClassName} />
      </div>
    </div>
  );
}
