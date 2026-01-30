'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { createSession, sessionExists } from '@/lib/firebase';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionCode, setSessionCode] = useState('');
  const [glitchText, setGlitchText] = useState(false);
  const [creatingTest, setCreatingTest] = useState(false);
  const [validating, setValidating] = useState(false);
  const [codeError, setCodeError] = useState('');

  // Auto-create test game with debug mode
  useEffect(() => {
    if (searchParams.has('newTestGame') && !creatingTest) {
      setCreatingTest(true);
      createSession().then((sessionId) => {
        router.replace(`/dashboard/${sessionId}?debug=true`);
      }).catch((err) => {
        console.error('Failed to create test game:', err);
        setCreatingTest(false);
      });
    }
  }, [searchParams, creatingTest, router]);

  // Periodic glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 150);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = sessionCode.trim().toUpperCase();
    if (!code) return;

    setCodeError('');
    setValidating(true);
    try {
      const exists = await sessionExists(code);
      if (exists) {
        router.push(`/join/${code}`);
      } else {
        setCodeError('Session not found');
      }
    } catch {
      setCodeError('Connection error — try again');
    } finally {
      setValidating(false);
    }
  };

  if (creatingTest) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-mono text-neon-blue animate-pulse mb-4">
            INITIALIZING TEST GAME...
          </div>
          <div className="text-text-muted font-mono text-sm">Creating session with debug mode</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark cyber-grid scanlines flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl relative z-10"
      >
        {/* Title */}
        <motion.h1
          className={`text-5xl md:text-7xl font-title font-bold text-white mb-2 tracking-tight ${glitchText ? 'animate-flicker' : ''}`}
        >
          <span className="text-glow-cyan">MAKE YOUR OWN</span>
        </motion.h1>
        <motion.h1
          className="text-5xl md:text-7xl font-title font-bold mb-6 tracking-tight"
        >
          <span className="text-glow-pink text-neon-pink">BUBBLE</span>
        </motion.h1>

        <div className="h-1 w-48 bg-gradient-to-r from-neon-blue to-neon-pink mx-auto mb-8 animate-pulse-glow" />

        <p className="text-xl text-text-muted mb-12">
          Enter the session code to join
        </p>

        {/* Join Form */}
        <form onSubmit={handleJoinSession} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={sessionCode}
              onChange={(e) => { setSessionCode(e.target.value.toUpperCase()); setCodeError(''); }}
              placeholder="CODE"
              maxLength={6}
              className={`w-full px-8 py-6 bg-bg-card/80 border-2 rounded-none
                       text-white placeholder-text-muted/40 font-title text-4xl md:text-5xl text-center
                       focus:outline-none focus:shadow-neon-blue
                       uppercase tracking-[0.5em] transition-all
                       ${codeError ? 'border-danger/70 focus:border-danger' : 'border-neon-blue/50 focus:border-neon-blue'}`}
              autoFocus
            />
            <div className={`absolute inset-0 pointer-events-none border-2 translate-x-1 translate-y-1
                          ${codeError ? 'border-danger/20' : 'border-neon-blue/20'}`} />
          </div>

          {codeError && (
            <p className="text-danger font-mono text-sm">{codeError}</p>
          )}

          <motion.button
            type="submit"
            disabled={!sessionCode.trim() || validating}
            whileHover={{ scale: sessionCode.trim() && !validating ? 1.02 : 1 }}
            whileTap={{ scale: sessionCode.trim() && !validating ? 0.98 : 1 }}
            className={`w-full py-5 text-2xl font-title font-bold uppercase tracking-widest transition-all
                      ${sessionCode.trim() && !validating
                        ? 'bg-gradient-to-r from-neon-blue to-neon-pink text-white shadow-neon-blue hover:shadow-neon-pink'
                        : 'bg-bg-card text-text-muted cursor-not-allowed'
                      }`}
          >
            {validating ? '[ CHECKING... ]' : sessionCode.trim() ? '[ ENTER ]' : '[ WAITING FOR CODE ]'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
