'use client';

import { motion } from 'framer-motion';

interface SharedRealityMeterProps {
  percentage: number;
}

export function SharedRealityMeter({ percentage }: SharedRealityMeterProps) {
  // Determine color based on percentage
  const getColor = (value: number): string => {
    if (value >= 70) return '#22C55E'; // Green
    if (value >= 40) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const color = getColor(percentage);

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <span className="text-text-muted text-sm uppercase tracking-wide">
          Shared Reality
        </span>
        <motion.span
          key={percentage}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-bold"
          style={{ color }}
        >
          {percentage}%
        </motion.span>
      </div>

      {/* Progress Bar */}
      <div className="h-4 bg-bg-card rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-1 text-xs text-text-muted">
        <span>Diverged</span>
        <span>Identical</span>
      </div>
    </div>
  );
}
