import React from 'react';
import { AuthorWelcomeModal } from '@common/shared/ui-kit';
import { requireServerUser } from '../../shared/lib/getServerUser';
import MobileHeader from '@/shared/features/patient-panel/_common/MobileHeader/MobileHeader';
import Sidebar from '@/shared/features/patient-panel/_common/Sidebar/Sidebar';
import { redirect } from 'next/navigation';

export default async function PatientPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireServerUser();

  if(!user) {
    redirect('/auth');
  }

  return (
    <div className="flex h-screen w-full max-w-[1300px] items-center justify-center overflow-hidden mx-auto">
      <div className="max-h-[1600px] flex h-full w-full min-h-0 flex-col gap-3 overflow-hidden p-3 lg:flex-row lg:gap-4 lg:p-4">
        <MobileHeader user={user} />
        <Sidebar user={user} />
        <main className="flex h-[calc(100%-2rem)] min-h-0 min-w-0 flex-1 flex-col overflow-y-auto rounded-[28px] border border-calm-border/50 shadow-subtle backdrop-blur-md">
          <AuthorWelcomeModal userId={user.id} />
          {children}
        </main>
      </div>
    </div>
  );
}
