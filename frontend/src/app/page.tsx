'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import LandingPage from '@/components/LandingPage';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return <LandingPage />;
  }

  return <Dashboard />;
}
