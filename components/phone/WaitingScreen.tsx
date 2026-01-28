'use client';

import { motion } from 'framer-motion';

interface WaitingScreenProps {
  name: string;
  participantCount: number;
}

export function WaitingScreen({ name, participantCount }: WaitingScreenProps) {
  return (
    <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>

        {/* Welcome Message */}
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          You&apos;re in!
        </h2>
        <p className="text-xl text-text-primary mb-8">
          Hi, <span className="text-primary font-semibold">{name}</span>
        </p>

        {/* Waiting Message */}
        <p className="text-text-muted mb-4">
          Waiting for game to start...
        </p>

        {/* Pulsing Animation */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Participant Count */}
        <div className="border-t border-slate-700 pt-6">
          <p className="text-text-muted">
            <span className="text-text-primary font-semibold text-xl">
              {participantCount}
            </span>{' '}
            participant{participantCount !== 1 ? 's' : ''} ready
          </p>
        </div>
      </motion.div>
    </div>
  );
}
