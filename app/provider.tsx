'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { AuthProvider } from '@/components/session-provider';

// Saves the logged-in user in the DB (no-op if they already exist).
function SaveUser() {
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      axios.post('/api/user').catch(console.error);
    }
  }, [status]);

  return null;
}

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SaveUser />
      {children}
    </AuthProvider>
  );
}
