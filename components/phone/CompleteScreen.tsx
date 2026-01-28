'use client';

import { motion } from 'framer-motion';
import { getCategoryDisplayName, getCategoryEmoji } from '@/lib/similarity';

interface CompleteScreenProps {
  totalRated: number;
  topCategories: string[];
}

export function CompleteScreen({ totalRated, topCategories }: CompleteScreenProps) {
  return (
    <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-sm"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg
            className="w-10 h-10 text-white"
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

        {/* Completion Message */}
        <h2 className="text-3xl font-bold text-text-primary mb-4">
          All done!
        </h2>
        <p className="text-xl text-text-muted mb-8">
          You rated <span className="text-primary font-bold">{totalRated}</span> items
        </p>

        {/* Watch Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-bg-card rounded-xl p-6 mb-8"
        >
          <div className="text-4xl mb-2">👀</div>
          <p className="text-text-primary font-semibold">
            Watch the dashboard
          </p>
          <p className="text-text-muted text-sm">
            to see the results!
          </p>
        </motion.div>

        {/* Top Categories */}
        {topCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="border-t border-slate-700 pt-6"
          >
            <p className="text-text-muted mb-4">Your top interests:</p>
            <div className="space-y-2">
              {topCategories.map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-3 bg-bg-card rounded-lg px-4 py-3"
                >
                  <span className="text-2xl">{getCategoryEmoji(category)}</span>
                  <span className="text-text-primary font-medium">
                    {getCategoryDisplayName(category)}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
