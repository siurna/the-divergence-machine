'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createSession } from '@/lib/firebase';

export default function Home() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [sessionCode, setSessionCode] = useState('');

  const handleCreateSession = async () => {
    setIsCreating(true);
    try {
      const sessionId = await createSession();
      router.push(`/dashboard/${sessionId}`);
    } catch (error) {
      console.error('Failed to create session:', error);
      alert('Failed to create session. Please check your Firebase configuration.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionCode.trim()) {
      router.push(`/join/${sessionCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl"
      >
        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-4">
          THE DIVERGENCE
          <br />
          <span className="text-primary">MACHINE</span>
        </h1>

        <div className="h-1 w-48 bg-primary mx-auto rounded-full mb-6" />

        <p className="text-xl text-text-muted mb-12">
          Discover how recommendation algorithms create filter bubbles
          <br />
          in real-time with your audience.
        </p>

        {/* Actions */}
        <div className="space-y-8">
          {/* Presenter Section */}
          <div className="bg-bg-card rounded-2xl p-8">
            <h2 className="text-lg font-semibold text-text-muted mb-4 uppercase tracking-wide">
              For Presenters
            </h2>
            <motion.button
              onClick={handleCreateSession}
              disabled={isCreating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg
                       hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create New Session'}
            </motion.button>
          </div>

          {/* Participant Section */}
          <div className="bg-bg-card rounded-2xl p-8">
            <h2 className="text-lg font-semibold text-text-muted mb-4 uppercase tracking-wide">
              For Participants
            </h2>
            <form onSubmit={handleJoinSession} className="flex gap-3">
              <input
                type="text"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                placeholder="Enter session code"
                maxLength={6}
                className="flex-1 px-4 py-3 bg-bg-dark border border-slate-600 rounded-xl
                         text-text-primary placeholder-slate-500 font-mono text-lg text-center
                         focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
                         uppercase tracking-widest"
              />
              <motion.button
                type="submit"
                disabled={!sessionCode.trim()}
                whileHover={{ scale: sessionCode.trim() ? 1.02 : 1 }}
                whileTap={{ scale: sessionCode.trim() ? 0.98 : 1 }}
                className={`px-8 py-3 rounded-xl font-bold transition-colors
                          ${
                            sessionCode.trim()
                              ? 'bg-success text-white hover:bg-green-600'
                              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                          }`}
              >
                Join
              </motion.button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-12 text-sm text-text-muted">
          An interactive demonstration of filter bubbles
          <br />
          for classroom presentations
        </p>
      </motion.div>
    </div>
  );
}
