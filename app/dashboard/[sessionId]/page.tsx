'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  subscribeToSession,
  updateGameState,
  updateAllPositions,
  updateSessionStats,
  resetSession,
  addParticipant,
  recordChoice,
} from '@/lib/firebase';
import {
  calculateSharedReality,
  calculateAllPositions,
  calculateTotalChoices,
  calculateAverageProgress,
  detectClusters,
  findMostUnique,
  findMostMainstream,
} from '@/lib/similarity';
import { contentPool, getCategoryColor } from '@/lib/content';
import { Session, GameState, Participant, ClusterInfo, Choice } from '@/types';

export default function DashboardPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId as string;
  const isDebugMode = searchParams.get('debug') === 'true' || searchParams.get('debug') === '';

  const [session, setSession] = useState<Session | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [sharedReality, setSharedReality] = useState(100);
  const [clusters, setClusters] = useState<ClusterInfo[]>([]);
  const [showQR, setShowQR] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const updateRef = useRef<NodeJS.Timeout | null>(null);
  const debugRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to session data
  useEffect(() => {
    const unsubscribe = subscribeToSession(sessionId, (data) => {
      setSession(data);
      if (data?.config?.roundDurationSeconds && data.gameState === 'waiting') {
        setTimeRemaining(data.config.roundDurationSeconds);
      }
    });
    return () => unsubscribe();
  }, [sessionId]);

  // Debug mode - simulate random participants
  useEffect(() => {
    if (!isDebugMode || !session || session.gameState !== 'playing') {
      if (debugRef.current) {
        clearInterval(debugRef.current);
        debugRef.current = null;
      }
      return;
    }

    const simulateParticipants = async () => {
      const participants = session.participants || {};
      const participantCount = Object.keys(participants).length;

      // Add more participants if under 35
      if (participantCount < 35) {
        const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Parker'];
        const randomName = names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100);
        await addParticipant(sessionId, randomName);
      }

      // Make random choices for existing participants
      for (const participant of Object.values(participants)) {
        if (Math.random() > 0.7) {
          const choices = participant.choices ? Object.values(participant.choices) : [];
          if (choices.length < 40) {
            const unseenContent = contentPool.filter(
              (c) => !choices.some((ch: Choice) => ch.contentId === c.id)
            );
            if (unseenContent.length > 0) {
              const randomContent = unseenContent[Math.floor(Math.random() * unseenContent.length)];
              await recordChoice(sessionId, participant.odId, {
                contentId: randomContent.id,
                action: Math.random() > 0.4 ? 'like' : 'skip',
                timestamp: Date.now(),
              });
            }
          }
        }
      }
    };

    debugRef.current = setInterval(simulateParticipants, 500);
    return () => {
      if (debugRef.current) clearInterval(debugRef.current);
    };
  }, [isDebugMode, session?.gameState, sessionId]);

  // Calculate and update stats periodically
  useEffect(() => {
    if (!session || session.gameState !== 'playing') {
      if (updateRef.current) {
        clearInterval(updateRef.current);
        updateRef.current = null;
      }
      return;
    }

    const updateStats = async () => {
      const participants = session.participants || {};
      const participantList = Object.values(participants) as Participant[];
      if (participantList.length < 2) return;

      const reality = calculateSharedReality(participantList);
      setSharedReality(reality);

      const positions = calculateAllPositions(participants);
      await updateAllPositions(sessionId, positions);

      const totalCards = session.config?.cardsPerParticipant || 40;
      await updateSessionStats(sessionId, {
        sharedReality: reality,
        totalChoicesMade: calculateTotalChoices(participants),
        averageProgress: calculateAverageProgress(participants, totalCards),
      });
    };

    updateStats();
    updateRef.current = setInterval(updateStats, 2000);
    return () => {
      if (updateRef.current) clearInterval(updateRef.current);
    };
  }, [session, sessionId]);

  // Timer logic
  useEffect(() => {
    if (!session) return;

    if (session.gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev: number) => {
          if (prev <= 1) {
            handleReveal();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session?.gameState]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!session) return;
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (session.gameState === 'waiting') handleStart();
          else if (session.gameState === 'playing') handlePause();
          else if (session.gameState === 'paused') handleResume();
          break;
        case 'KeyR':
          if (session.gameState === 'playing' || session.gameState === 'paused') handleReveal();
          break;
        case 'Escape':
          if (session.gameState === 'reveal' || session.gameState === 'ended') handleReset();
          break;
        case 'KeyQ':
          setShowQR((prev) => !prev);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [session?.gameState]);

  const handleStart = useCallback(async () => {
    await updateGameState(sessionId, 'playing');
    setShowQR(false);
  }, [sessionId]);

  const handlePause = useCallback(async () => {
    await updateGameState(sessionId, 'paused');
  }, [sessionId]);

  const handleResume = useCallback(async () => {
    await updateGameState(sessionId, 'playing');
  }, [sessionId]);

  const handleReveal = useCallback(async () => {
    await updateGameState(sessionId, 'reveal');
    if (session?.participants) {
      const participantList = Object.values(session.participants) as Participant[];
      const detectedClusters = detectClusters(session.participants, 0.4);
      setClusters(detectedClusters);
      await updateSessionStats(sessionId, {
        sharedReality: calculateSharedReality(participantList),
        clusters: detectedClusters,
        mostUnique: findMostUnique(session.participants),
        mostMainstream: findMostMainstream(session.participants),
      });
    }
  }, [sessionId, session?.participants]);

  const handleReset = useCallback(async () => {
    await resetSession(sessionId);
    setTimeRemaining(session?.config?.roundDurationSeconds || 180);
    setSharedReality(100);
    setClusters([]);
    setShowQR(true);
  }, [sessionId, session?.config?.roundDurationSeconds]);

  if (!session) {
    return (
      <div className="h-screen bg-bg-dark cyber-grid flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-muted font-mono">LOADING SESSION...</p>
        </div>
      </div>
    );
  }

  const participants = session.participants || {};
  const participantList = Object.values(participants) as Participant[];
  const participantCount = participantList.filter((p) => p.isActive !== false).length;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const joinUrl = typeof window !== 'undefined' ? `${window.location.origin}/join/${sessionId}` : '';

  // Reveal mode
  if (session.gameState === 'reveal') {
    return (
      <div className="h-screen bg-bg-dark cyber-grid overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 text-center">
          <h1 className="projector-text-xl text-glow-cyan">FILTER BUBBLE FORMED</h1>
        </div>

        {/* Main insight */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-4xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="mb-8"
            >
              <p className="text-text-muted text-2xl mb-4">You started with</p>
              <p className="text-9xl font-black text-glow-green text-neon-green">100%</p>
              <p className="text-text-muted text-2xl">shared reality</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-4xl text-text-muted mb-8"
            >
              ↓
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, delay: 1.5 }}
            >
              <p className="text-text-muted text-2xl mb-4">You ended with only</p>
              <p className={`text-9xl font-black ${sharedReality < 40 ? 'text-glow-pink text-neon-pink' : 'text-glow-cyan text-warning'}`}>
                {sharedReality}%
              </p>
              <p className="text-text-muted text-2xl">shared reality</p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
              className="mt-16 text-3xl text-text-muted"
            >
              {clusters.length > 0 && (
                <>
                  <span className="text-neon-blue">{clusters.length}</span> distinct bubbles formed among{' '}
                  <span className="text-neon-pink">{participantCount}</span> people
                </>
              )}
            </motion.p>
          </div>
        </div>

        {/* Reset button */}
        <div className="p-6 text-center">
          <button
            onClick={handleReset}
            className="px-12 py-4 bg-bg-card border-2 border-text-muted text-text-muted font-bold text-xl
                     uppercase tracking-wider hover:border-neon-blue hover:text-neon-blue transition-all"
          >
            [ RESET ] or press ESC
          </button>
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="h-screen bg-bg-dark cyber-grid overflow-hidden flex flex-col relative">
      {/* Minimal header */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-4">
        <span className="font-mono text-text-muted">
          {session.gameState === 'waiting' ? 'WAITING' : session.gameState === 'playing' ? 'LIVE' : 'PAUSED'}
        </span>
        {(session.gameState === 'playing' || session.gameState === 'paused') && (
          <span className="font-mono text-3xl text-neon-blue text-glow-cyan">{formatTime(timeRemaining)}</span>
        )}
      </div>

      {/* Participant count */}
      <div className="absolute top-4 right-4 z-20">
        <span className="font-mono text-neon-pink text-glow-pink text-2xl">{participantCount}</span>
        <span className="font-mono text-text-muted ml-2">connected</span>
      </div>

      {/* QR Code overlay */}
      <AnimatePresence>
        {showQR && session.gameState === 'waiting' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-bg-dark/95 flex items-center justify-center"
          >
            <div className="text-center">
              <h1 className="projector-text-xl text-glow-cyan mb-4">MAKE YOUR OWN BUBBLE</h1>
              <p className="text-2xl text-text-muted mb-8">Scan to join</p>

              <div className="bg-white p-8 inline-block mb-8">
                <QRCodeSVG value={joinUrl} size={350} level="H" />
              </div>

              <p className="text-text-muted text-xl mb-2">or enter code:</p>
              <p className="text-8xl font-black text-glow-pink text-neon-pink tracking-[0.3em]">{sessionId}</p>

              <p className="mt-12 text-text-muted">Press SPACE to start • Q to toggle QR</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main visualization area */}
      <div className="flex-1 relative">
        <BubbleVisualization participants={participants} clusters={clusters} />
      </div>

      {/* Bottom bar - Shared Reality */}
      <div className="h-24 bg-bg-card/80 border-t border-neon-blue/30 flex items-center px-8">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-text-muted uppercase tracking-wider">Shared Reality</span>
            <span className={`font-mono text-4xl font-bold ${
              sharedReality > 60 ? 'text-neon-green text-glow-green' :
              sharedReality > 30 ? 'text-warning' : 'text-neon-pink text-glow-pink'
            }`}>
              {sharedReality}%
            </span>
          </div>
          <div className="h-4 bg-bg-dark rounded-none overflow-hidden">
            <motion.div
              className={`h-full ${
                sharedReality > 60 ? 'bg-neon-green shadow-neon-green' :
                sharedReality > 30 ? 'bg-warning' : 'bg-neon-pink shadow-neon-pink'
              }`}
              initial={{ width: '100%' }}
              animate={{ width: `${sharedReality}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Control buttons */}
        <div className="ml-8 flex gap-4">
          {session.gameState === 'waiting' && (
            <button onClick={handleStart} className="px-8 py-3 bg-neon-green text-black font-bold uppercase tracking-wider hover:shadow-neon-green transition-all">
              START
            </button>
          )}
          {session.gameState === 'playing' && (
            <>
              <button onClick={handlePause} className="px-6 py-3 bg-warning text-black font-bold uppercase tracking-wider">
                PAUSE
              </button>
              <button onClick={handleReveal} className="px-6 py-3 bg-neon-pink text-black font-bold uppercase tracking-wider hover:shadow-neon-pink transition-all">
                REVEAL
              </button>
            </>
          )}
          {session.gameState === 'paused' && (
            <>
              <button onClick={handleResume} className="px-6 py-3 bg-neon-green text-black font-bold uppercase tracking-wider">
                RESUME
              </button>
              <button onClick={handleReveal} className="px-6 py-3 bg-neon-pink text-black font-bold uppercase tracking-wider">
                REVEAL
              </button>
            </>
          )}
        </div>
      </div>

      {/* Debug indicator */}
      {isDebugMode && (
        <div className="absolute bottom-28 left-4 bg-warning/20 border border-warning text-warning px-3 py-1 font-mono text-sm">
          DEBUG MODE
        </div>
      )}
    </div>
  );
}

// Bubble Visualization Component
function BubbleVisualization({
  participants,
  clusters,
}: {
  participants: Record<string, Participant>;
  clusters: ClusterInfo[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

  const participantList = Object.values(participants).filter((p) => p.isActive !== false) as Participant[];

  const getPixelPosition = (position: { x: number; y: number }, padding = 80) => {
    const { width, height } = dimensions;
    return {
      x: padding + (position.x / 100) * (width - padding * 2),
      y: padding + (position.y / 100) * (height - padding * 2),
    };
  };

  const getTopCategories = (participant: Participant): string[] => {
    const choices = participant.choices ? Object.values(participant.choices) : [];
    const likes = choices.filter((c: Choice) => c.action === 'like');
    const categoryCount: Record<string, number> = {};

    for (const choice of likes) {
      const content = contentPool.find((c) => c.id === choice.contentId);
      if (content) {
        const group = content.category.split('_')[0];
        categoryCount[group] = (categoryCount[group] || 0) + 1;
      }
    }

    return Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat]) => cat);
  };

  const getGradientColors = (categories: string[]): string[] => {
    const colorMap: Record<string, string> = {
      politics: '#FF0055',
      tech: '#00F0FF',
      entertainment: '#FF00E5',
      science: '#39FF14',
      sports: '#FF6B00',
      lifestyle: '#BF00FF',
      finance: '#FFE500',
      animals: '#FF8800',
    };
    return categories.map((c) => colorMap[c] || '#00F0FF');
  };

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-radial opacity-50" />

      {/* Bubbles */}
      <AnimatePresence>
        {participantList.map((participant, index) => {
          const position = getPixelPosition(participant.position || { x: 50, y: 50 });
          const choices = participant.choices ? Object.values(participant.choices) : [];
          const size = Math.max(40, Math.min(30 + choices.length * 1.5, 80));
          const topCats = getTopCategories(participant);
          const colors = getGradientColors(topCats);
          const gradientId = `gradient-${participant.odId}`;

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
                stiffness: 80,
                damping: 15,
                delay: index * 0.02,
              }}
            >
              <svg width={size} height={size} className="bubble-animated">
                <defs>
                  <radialGradient id={gradientId}>
                    <stop offset="0%" stopColor={colors[0] || '#00F0FF'} />
                    <stop offset="50%" stopColor={colors[1] || colors[0] || '#00F0FF'} />
                    <stop offset="100%" stopColor={colors[2] || colors[1] || colors[0] || '#00F0FF'} stopOpacity="0.6" />
                  </radialGradient>
                </defs>
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={size / 2 - 2}
                  fill={`url(#${gradientId})`}
                  style={{
                    filter: `drop-shadow(0 0 ${size / 4}px ${colors[0] || '#00F0FF'})`,
                  }}
                />
              </svg>
              <div
                className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-white font-medium"
                style={{ top: size + 4 }}
              >
                {participant.name}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Empty state */}
      {participantList.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-text-muted text-2xl font-mono">Waiting for participants...</p>
        </div>
      )}
    </div>
  );
}
