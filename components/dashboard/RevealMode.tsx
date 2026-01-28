'use client';

import { motion } from 'framer-motion';
import { ClusterInfo, Participant } from '@/types';

interface RevealModeProps {
  initialSharedReality: number;
  finalSharedReality: number;
  clusters: ClusterInfo[];
  participants: Record<string, Participant>;
  mostUnique?: string;
  mostMainstream?: string;
}

export function RevealMode({
  initialSharedReality,
  finalSharedReality,
  clusters,
  participants,
  mostUnique,
  mostMainstream,
}: RevealModeProps) {
  const getParticipantName = (odId: string): string => {
    return participants[odId]?.name || 'Unknown';
  };

  // Calculate overlap percentages
  const uniqueOverlap = mostUnique ? calculateOverlap(mostUnique, participants) : 0;
  const mainstreamOverlap = mostMainstream
    ? calculateOverlap(mostMainstream, participants)
    : 0;

  // Find strongest cluster
  const strongestCluster = clusters.reduce(
    (max, cluster) =>
      cluster.memberIds.length > (max?.memberIds.length || 0) ? cluster : max,
    clusters[0]
  );

  return (
    <div className="space-y-6">
      {/* Main Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-text-primary mb-4">
          FINAL RESULTS
        </h2>
        <div className="h-1 w-32 bg-primary mx-auto rounded-full mb-6" />

        <p className="text-xl text-text-muted mb-2">
          You started{' '}
          <span className="text-success font-bold">{initialSharedReality}%</span>{' '}
          identical.
        </p>
        <p className="text-2xl text-text-primary">
          You ended with only{' '}
          <motion.span
            initial={{ color: '#22C55E' }}
            animate={{ color: finalSharedReality < 40 ? '#EF4444' : '#F59E0B' }}
            transition={{ duration: 1 }}
            className="font-bold"
          >
            {finalSharedReality}%
          </motion.span>{' '}
          shared reality.
        </p>
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-bg-card rounded-xl p-6"
      >
        <h3 className="text-lg font-bold text-text-primary mb-4">INSIGHTS</h3>

        <ul className="space-y-3 text-text-muted">
          {mostUnique && (
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-start gap-2"
            >
              <span className="text-primary">•</span>
              <span>
                <strong className="text-text-primary">Most unique taste:</strong>{' '}
                {getParticipantName(mostUnique)} (only {uniqueOverlap}% overlap
                with group average)
              </span>
            </motion.li>
          )}

          {mostMainstream && (
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="flex items-start gap-2"
            >
              <span className="text-primary">•</span>
              <span>
                <strong className="text-text-primary">Most mainstream:</strong>{' '}
                {getParticipantName(mostMainstream)} ({mainstreamOverlap}% overlap
                with group average)
              </span>
            </motion.li>
          )}

          {strongestCluster && (
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="flex items-start gap-2"
            >
              <span className="text-primary">•</span>
              <span>
                <strong className="text-text-primary">Strongest cluster:</strong>{' '}
                {strongestCluster.label} ({strongestCluster.memberIds.length}{' '}
                people)
              </span>
            </motion.li>
          )}
        </ul>
      </motion.div>

      {/* Cluster Summary */}
      {clusters.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {clusters.map((cluster, index) => (
            <motion.div
              key={cluster.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + index * 0.1 }}
              className="bg-bg-card rounded-xl p-4 border border-slate-700"
            >
              <h4 className="text-primary font-bold mb-2">{cluster.label}</h4>
              <p className="text-text-muted text-sm mb-2">
                {cluster.memberIds.length} member
                {cluster.memberIds.length !== 1 ? 's' : ''}
              </p>
              <div className="flex flex-wrap gap-1">
                {cluster.memberIds.slice(0, 5).map((id) => (
                  <span
                    key={id}
                    className="text-xs bg-slate-700 px-2 py-1 rounded"
                  >
                    {getParticipantName(id)}
                  </span>
                ))}
                {cluster.memberIds.length > 5 && (
                  <span className="text-xs text-text-muted">
                    +{cluster.memberIds.length - 5} more
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Key Takeaway */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="bg-primary/20 border border-primary/50 rounded-xl p-6 text-center"
      >
        <p className="text-xl text-text-primary">
          This is how filter bubbles form.
          <br />
          <span className="text-text-muted">
            A few choices lead to completely different realities.
          </span>
        </p>
      </motion.div>
    </div>
  );
}

// Helper function to calculate overlap percentage
function calculateOverlap(
  odId: string,
  participants: Record<string, Participant>
): number {
  // Simplified calculation - returns a mock value
  // In production, this would use the actual similarity calculations
  const participant = participants[odId];
  if (!participant) return 0;

  const choices = participant.choices ? Object.values(participant.choices) : [];
  const likes = choices.filter((c) => c.action === 'like').length;

  // Mock calculation based on number of likes vs average
  const allParticipants = Object.values(participants);
  const avgLikes =
    allParticipants.reduce((sum, p) => {
      const pChoices = p.choices ? Object.values(p.choices) : [];
      return sum + pChoices.filter((c) => c.action === 'like').length;
    }, 0) / allParticipants.length;

  // Return a percentage based on deviation from average
  const deviation = Math.abs(likes - avgLikes) / avgLikes;
  return Math.round((1 - Math.min(deviation, 1)) * 100);
}
