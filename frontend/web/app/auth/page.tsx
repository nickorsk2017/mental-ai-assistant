import React from 'react';
import AuthenticationPage from '../../shared/features/auth/AuthPage';
import { getServerUser } from '../../shared/lib/getServerUser';

export default async function AuthPageServer() {
  await getServerUser();

  return <AuthenticationPage />;
}
