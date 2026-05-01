'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthenticationStore } from '@common/shared/stores/useAuthStore';
import { AuthForm } from '@common/shared/ui-kit';

export default function AuthPage() {
  const router = useRouter();
  const currentUser = useAuthenticationStore((state) => state.currentUser);

  useEffect(() => {
    if (currentUser) {
      router.replace('/dashboard');
    }
  }, [currentUser, router]);

  if (currentUser) { return null; }

  return (
    <div className="h-screen items-center justify-center bg-calm-background md:min-h-screen md:p-4 flex">
      <AuthForm />
    </div>
  );
}
