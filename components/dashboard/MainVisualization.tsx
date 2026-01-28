'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Participant, ClusterInfo } from '@/types';
import { getCategoryColor } from '@/lib/content';

interface MainVisualizationProps {
  participants: Record<string, Participant>;
  showClusters?: boolean;
  clusters?: ClusterInfo[];
}

export function MainVisualization({
  participants,
  showClusters = false,
  clusters = [],
}: MainVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const participantList = Object.values(participants).filter(
    (p) => p.isActive !== false
  );

  // Convert percentage positions to pixel positions
  const getPixelPosition = (
    position: { x: number; y: number },
    padding = 50
  ) => {
    const { width, height } = dimensions;
    const usableWidth = width - padding * 2;
    const usableHeight = height - padding * 2;

    return {
      x: padding + (position.x / 100) * usableWidth,
      y: padding + (position.y / 100) * usableHeight,
    };
  };

  // Get dominant category for a participant
  const getDominantCategory = (participant: Participant): string => {
    const choices = participant.choices
      ? Object.values(participant.choices)
      : [];
    const likes = choices.filter((c) => c.action === 'like');

    if (likes.length === 0) return 'tech'; // Default

    // This is a simplified version - in production would track categories
    return 'tech';
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-bg-dark rounded-xl relative overflow-hidden"
      style={{ minHeight: '400px' }}
    >
      {/* Grid Background */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-slate-500"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Cluster Boundaries (shown during reveal) */}
      <AnimatePresence>
        {showClusters &&
          clusters.map((cluster, index) => {
            const centroid = getPixelPosition(cluster.centroid);
            return (
              <motion.div
                key={cluster.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.2 }}
                className="absolute"
                style={{
                  left: centroid.x - 100,
                  top: centroid.y - 60,
                }}
              >
                <div className="border-2 border-dashed border-primary/50 rounded-2xl px-8 py-4 bg-primary/10">
                  <p className="text-primary font-bold text-center whitespace-nowrap">
                    {cluster.label}
                  </p>
                  <p className="text-text-muted text-sm text-center">
                    {cluster.memberIds.length} people
                  </p>
                </div>
              </motion.div>
            );
          })}
      </AnimatePresence>

      {/* Participant Dots */}
      <AnimatePresence>
        {participantList.map((participant) => {
          const position = getPixelPosition(participant.position || { x: 50, y: 50 });
          const category = getDominantCategory(participant);
          const color = getCategoryColor(category);
          const choices = participant.choices
            ? Object.values(participant.choices)
            : [];
          const size = Math.min(20 + choices.length * 0.5, 40);

          return (
            <motion.div
              key={participant.odId}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: position.x - size / 2,
                y: position.y - size / 2,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 15,
              }}
            >
              {/* Dot */}
              <motion.div
                className="rounded-full shadow-lg"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: color,
                  boxShadow: `0 0 20px ${color}40`,
                }}
                whileHover={{ scale: 1.2 }}
              />

              {/* Name Label */}
              <div
                className="absolute left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap
                         text-xs text-text-primary font-medium"
                style={{ top: size }}
              >
                {participant.name}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Empty State */}
      {participantList.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-text-muted text-lg">
            Waiting for participants to join...
          </p>
        </div>
      )}
    </div>
  );
}
