'use client';

import { motion } from 'framer-motion';

interface StatsPanelProps {
  participantCount: number;
  totalChoices: number;
  averageProgress: number;
  mostActive?: { name: string; progress: string };
}

export function StatsPanel({
  participantCount,
  totalChoices,
  averageProgress,
  mostActive,
}: StatsPanelProps) {
  return (
    <div className="bg-bg-card rounded-xl p-4 space-y-4">
      <h3 className="text-text-muted text-sm uppercase tracking-wide">
        Stats
      </h3>

      <div className="space-y-3">
        <StatItem label="Participants" value={participantCount.toString()} />
        <StatItem label="Choices made" value={totalChoices.toLocaleString()} />
        <StatItem label="Avg progress" value={`${averageProgress}%`} />
        {mostActive && (
          <StatItem
            label="Most active"
            value={`${mostActive.name} (${mostActive.progress})`}
          />
        )}
      </div>
    </div>
  );
}

interface StatItemProps {
  label: string;
  value: string;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-text-muted text-sm">{label}</span>
      <motion.span
        key={value}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        className="text-text-primary font-semibold"
      >
        {value}
      </motion.span>
    </div>
  );
}
