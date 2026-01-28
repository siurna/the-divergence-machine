'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const [sessionCode, setSessionCode] = useState('');
  const [glitchText, setGlitchText] = useState(false);

  // Periodic glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 150);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleJoinSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionCode.trim()) {
      router.push(`/join/${sessionCode.trim().toUpperCase()}`);
    }
  };

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
          className={`text-5xl md:text-7xl font-black text-white mb-2 tracking-tight ${glitchText ? 'animate-flicker' : ''}`}
        >
          <span className="text-glow-cyan">MAKE YOUR OWN</span>
        </motion.h1>
        <motion.h1
          className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
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
              onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
              placeholder="SESSION CODE"
              maxLength={6}
              className="w-full px-8 py-6 bg-bg-card/80 border-2 border-neon-blue/50 rounded-none
                       text-white placeholder-text-muted font-mono text-4xl md:text-5xl text-center
                       focus:outline-none focus:border-neon-blue focus:shadow-neon-blue
                       uppercase tracking-[0.5em] transition-all"
              autoFocus
            />
            <div className="absolute inset-0 pointer-events-none border-2 border-neon-blue/20
                          translate-x-1 translate-y-1" />
          </div>

          <motion.button
            type="submit"
            disabled={!sessionCode.trim()}
            whileHover={{ scale: sessionCode.trim() ? 1.02 : 1 }}
            whileTap={{ scale: sessionCode.trim() ? 0.98 : 1 }}
            className={`w-full py-5 text-2xl font-bold uppercase tracking-widest transition-all
                      ${sessionCode.trim()
                        ? 'bg-gradient-to-r from-neon-blue to-neon-pink text-white shadow-neon-blue hover:shadow-neon-pink'
                        : 'bg-bg-card text-text-muted cursor-not-allowed'
                      }`}
          >
            {sessionCode.trim() ? '[ ENTER ]' : '[ WAITING FOR CODE ]'}
          </motion.button>
        </form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-sm text-text-muted font-mono"
        >
          {'>'} FILTER_BUBBLE_DEMONSTRATION_v1.0
        </motion.p>
      </motion.div>
    </div>
  );
}
