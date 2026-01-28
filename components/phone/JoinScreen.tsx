'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface JoinScreenProps {
  sessionId: string;
  participantCount: number;
  onJoin: (name: string) => void;
  isLoading?: boolean;
}

export function JoinScreen({
  sessionId,
  participantCount,
  onJoin,
  isLoading = false,
}: JoinScreenProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const isValidName = name.trim().length >= 2 && name.trim().length <= 15;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidName) {
      setError('Name must be 2-15 characters');
      return;
    }

    setError('');
    onJoin(name.trim());
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            THE DIVERGENCE MACHINE
          </h1>
          <div className="h-1 w-32 bg-primary mx-auto rounded-full" />
        </div>

        {/* Join Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-bg-card rounded-xl p-6">
            <label
              htmlFor="name"
              className="block text-text-muted text-sm mb-2"
            >
              Enter your first name:
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={15}
              className="w-full px-4 py-3 bg-bg-dark border border-slate-600 rounded-lg
                       text-text-primary placeholder-slate-500
                       focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
                       transition-colors"
              autoFocus
              autoComplete="off"
              disabled={isLoading}
            />
            {error && (
              <p className="text-danger text-sm mt-2">{error}</p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={!isValidName || isLoading}
            whileHover={{ scale: isValidName && !isLoading ? 1.02 : 1 }}
            whileTap={{ scale: isValidName && !isLoading ? 0.98 : 1 }}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all
                      ${
                        isValidName && !isLoading
                          ? 'bg-primary text-white hover:bg-primary-dark'
                          : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Joining...
              </span>
            ) : (
              'JOIN'
            )}
          </motion.button>
        </form>

        {/* Session Info */}
        <div className="mt-8 text-center text-text-muted text-sm">
          <p>Session: <span className="font-mono text-text-primary">{sessionId}</span></p>
          <p className="mt-1">
            {participantCount} participant{participantCount !== 1 ? 's' : ''} waiting
          </p>
        </div>
      </motion.div>
    </div>
  );
}
