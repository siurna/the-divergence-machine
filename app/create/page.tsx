'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSession } from '@/lib/firebase';

export default function CreatePage() {
  const router = useRouter();

  useEffect(() => {
    const create = async () => {
      try {
        const sessionId = await createSession();
        router.replace(`/dashboard/${sessionId}`);
      } catch (error) {
        console.error('Failed to create session:', error);
        router.replace('/');
      }
    };

    create();
  }, [router]);

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-text-muted">Creating session...</p>
      </div>
    </div>
  );
}
