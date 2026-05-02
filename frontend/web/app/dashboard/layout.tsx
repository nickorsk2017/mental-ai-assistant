import React from 'react';

import PatientAdminShell from '../../shared/features/dashboard/PatientAdminShell';
import { requireServerUser } from '../../shared/lib/getServerUser';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireServerUser();

  return <PatientAdminShell user={user}>{children}</PatientAdminShell>;
}
