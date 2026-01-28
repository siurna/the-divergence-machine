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

  // Debug mode controls
  const [debugSettings, setDebugSettings] = useState({
    maxParticipants: 35,
    simulationSpeed: 500,
    isSimulating: true,
  });

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
    if (!isDebugMode || !session || session.gameState !== 'playing' || !debugSettings.isSimulating) {
      if (debugRef.current) {
        clearInterval(debugRef.current);
        debugRef.current = null;
      }
      return;
    }

    const simulateParticipants = async () => {
      const participants = session.participants || {};
      const participantCount = Object.keys(participants).length;

      // Add more participants only if under max limit
      if (participantCount < debugSettings.maxParticipants) {
        const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Parker'];
        const randomName = names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100);
        await addParticipant(sessionId, randomName);
      }

      // Make random choices for existing participants
      const participantArray = Object.values(participants);
      // Only process a subset each tick to avoid overwhelming Firebase
      const toProcess = participantArray.slice(0, 10);
      for (const participant of toProcess) {
        if (Math.random() > 0.6) {
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

    debugRef.current = setInterval(simulateParticipants, debugSettings.simulationSpeed);
    return () => {
      if (debugRef.current) clearInterval(debugRef.current);
    };
  }, [isDebugMode, session?.gameState, sessionId, debugSettings.isSimulating, debugSettings.maxParticipants, debugSettings.simulationSpeed]);

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
    // Generate dispersing particles
    const particles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 400,
      delay: Math.random() * 1.5,
      color: ['#FF0055', '#00F0FF', '#FF00E5', '#39FF14', '#FF6B00', '#BF00FF'][Math.floor(Math.random() * 6)],
    }));

    return (
      <div className="h-screen bg-bg-dark cyber-grid overflow-hidden flex flex-col relative">
        {/* Site URL */}
        <div className="absolute top-4 left-4 z-20">
          <span className="site-url text-text-muted font-mono">makeyourownbubble.com</span>
        </div>

        {/* Header */}
        <div className="p-6 text-center">
          <h1 className="projector-text-xl text-glow-cyan">BUBBLE FORMED</h1>
        </div>

        {/* Main insight */}
        <div className="flex-1 flex items-center justify-center p-8 relative">
          {/* Dispersing particles animation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-8 h-10 rounded bg-gradient-to-b from-white/20 to-transparent"
                style={{
                  backgroundColor: particle.color,
                  boxShadow: `0 0 10px ${particle.color}`,
                }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 1, rotate: 0 }}
                animate={{
                  x: particle.x,
                  y: particle.y,
                  opacity: [0, 1, 1, 0],
                  scale: [1, 1, 0.5, 0],
                  rotate: (Math.random() - 0.5) * 180,
                }}
                transition={{
                  duration: 2.5,
                  delay: 1.5 + particle.delay,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>

          <div className="text-center max-w-4xl relative z-10">
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

            {/* Animated dispersing visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="relative h-32 mb-8"
            >
              {/* Compact cluster */}
              <motion.div
                className="absolute left-1/2 top-0 -translate-x-1/2 flex gap-1"
                animate={{ opacity: [1, 1, 0] }}
                transition={{ delay: 1, duration: 1 }}
              >
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full bg-neon-green"
                    style={{ boxShadow: '0 0 8px rgba(57, 255, 20, 0.5)' }}
                  />
                ))}
              </motion.div>

              {/* Arrow */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-text-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                ↓
              </motion.div>

              {/* Dispersed clusters */}
              <motion.div
                className="absolute left-1/2 bottom-0 -translate-x-1/2 flex gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-neon-pink" style={{ boxShadow: '0 0 6px rgba(255, 0, 229, 0.5)' }} />
                  <div className="w-3 h-3 rounded-full bg-neon-pink" style={{ boxShadow: '0 0 6px rgba(255, 0, 229, 0.5)' }} />
                </div>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-neon-blue" style={{ boxShadow: '0 0 6px rgba(0, 240, 255, 0.5)' }} />
                  <div className="w-3 h-3 rounded-full bg-neon-blue" style={{ boxShadow: '0 0 6px rgba(0, 240, 255, 0.5)' }} />
                  <div className="w-3 h-3 rounded-full bg-neon-blue" style={{ boxShadow: '0 0 6px rgba(0, 240, 255, 0.5)' }} />
                </div>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-warning" style={{ boxShadow: '0 0 6px rgba(255, 107, 0, 0.5)' }} />
                  <div className="w-3 h-3 rounded-full bg-warning" style={{ boxShadow: '0 0 6px rgba(255, 107, 0, 0.5)' }} />
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, delay: 2.5 }}
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
              transition={{ delay: 3.5 }}
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
      {/* Site URL */}
      <div className="absolute top-4 left-4 z-20">
        <span className="site-url text-text-muted font-mono">makeyourownbubble.com</span>
      </div>

      {/* Status header */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
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

              <p className="text-text-muted text-xl mb-2">code:</p>
              <p className="text-8xl font-black text-glow-pink text-neon-pink tracking-[0.3em]">{sessionId}</p>

              <p className="mt-12 text-text-muted">Press SPACE to start • Q to toggle QR</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main visualization area */}
      <div className="flex-1 relative">
        <BubbleVisualization participants={participants} showClusters={session.gameState === 'playing'} />
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

      {/* Debug controls panel */}
      {isDebugMode && (
        <div className="absolute bottom-28 left-4 bg-bg-card/90 border border-warning text-warning p-4 font-mono text-sm space-y-3 min-w-[200px]">
          <div className="text-xs uppercase tracking-wider mb-2">Debug Controls</div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-text-muted text-xs">Simulation</span>
            <button
              onClick={() => setDebugSettings(s => ({ ...s, isSimulating: !s.isSimulating }))}
              className={`px-2 py-1 text-xs ${debugSettings.isSimulating ? 'bg-neon-green/20 text-neon-green' : 'bg-danger/20 text-danger'}`}
            >
              {debugSettings.isSimulating ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-text-muted text-xs">Max Users</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDebugSettings(s => ({ ...s, maxParticipants: Math.max(5, s.maxParticipants - 5) }))}
                className="px-2 py-1 text-xs bg-bg-dark hover:bg-neon-blue/20"
              >
                -
              </button>
              <span className="w-8 text-center">{debugSettings.maxParticipants}</span>
              <button
                onClick={() => setDebugSettings(s => ({ ...s, maxParticipants: Math.min(100, s.maxParticipants + 5) }))}
                className="px-2 py-1 text-xs bg-bg-dark hover:bg-neon-blue/20"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-text-muted text-xs">Speed (ms)</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDebugSettings(s => ({ ...s, simulationSpeed: Math.min(2000, s.simulationSpeed + 100) }))}
                className="px-2 py-1 text-xs bg-bg-dark hover:bg-neon-blue/20"
              >
                -
              </button>
              <span className="w-12 text-center">{debugSettings.simulationSpeed}</span>
              <button
                onClick={() => setDebugSettings(s => ({ ...s, simulationSpeed: Math.max(100, s.simulationSpeed - 100) }))}
                className="px-2 py-1 text-xs bg-bg-dark hover:bg-neon-blue/20"
              >
                +
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-warning/30 text-text-muted text-xs">
            {participantCount} participants
          </div>
        </div>
      )}
    </div>
  );
}

// Bubble Visualization Component
function BubbleVisualization({
  participants,
  showClusters = false,
}: {
  participants: Record<string, Participant>;
  showClusters?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [liveClusters, setLiveClusters] = useState<{ center: { x: number; y: number }; radius: number; color: string; opacity: number }[]>([]);

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

  // Calculate real-time clusters
  useEffect(() => {
    if (!showClusters) return;

    const participantList = Object.values(participants).filter((p) => p.isActive !== false) as Participant[];
    if (participantList.length < 3) {
      setLiveClusters([]);
      return;
    }

    // Simple clustering based on position proximity
    const clusterColors = ['#FF0055', '#00F0FF', '#FF00E5', '#39FF14', '#FF6B00'];
    const threshold = 25; // Distance threshold for clustering
    const groups: Participant[][] = [];
    const assigned = new Set<string>();

    for (const p of participantList) {
      if (assigned.has(p.odId)) continue;

      const group: Participant[] = [p];
      assigned.add(p.odId);

      for (const other of participantList) {
        if (assigned.has(other.odId)) continue;
        const pos1 = p.position || { x: 50, y: 50 };
        const pos2 = other.position || { x: 50, y: 50 };
        const dist = Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));

        if (dist < threshold) {
          group.push(other);
          assigned.add(other.odId);
        }
      }

      if (group.length >= 2) {
        groups.push(group);
      }
    }

    // Convert groups to cluster visualizations
    const newClusters = groups.map((group, idx) => {
      const avgX = group.reduce((sum, p) => sum + (p.position?.x || 50), 0) / group.length;
      const avgY = group.reduce((sum, p) => sum + (p.position?.y || 50), 0) / group.length;
      const maxDist = Math.max(...group.map(p => {
        const pos = p.position || { x: 50, y: 50 };
        return Math.sqrt(Math.pow(pos.x - avgX, 2) + Math.pow(pos.y - avgY, 2));
      }));

      return {
        center: { x: avgX, y: avgY },
        radius: Math.max(maxDist + 10, 20),
        color: clusterColors[idx % clusterColors.length],
        opacity: Math.min(0.15 + group.length * 0.02, 0.3),
      };
    });

    setLiveClusters(newClusters);
  }, [participants, showClusters]);

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

  // Bubble size based on engagement (choices made) and how "extreme" preferences are
  const getBubbleSize = (participant: Participant): number => {
    const choices = participant.choices ? Object.values(participant.choices) : [];
    const choiceCount = choices.length;
    const likeCount = choices.filter((c: Choice) => c.action === 'like').length;

    // Base size from engagement (number of choices)
    const engagementSize = 25 + choiceCount * 0.8;

    // Bonus for having strong preferences (high like ratio or high skip ratio)
    const likeRatio = choiceCount > 0 ? likeCount / choiceCount : 0.5;
    const extremeness = Math.abs(likeRatio - 0.5) * 2; // 0 = balanced, 1 = all likes or all skips
    const extremeBonus = extremeness * 15;

    return Math.max(30, Math.min(engagementSize + extremeBonus, 70));
  };

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-radial opacity-50" />

      {/* Real-time cluster blobs */}
      <AnimatePresence>
        {showClusters && liveClusters.map((cluster, idx) => {
          const pixelPos = getPixelPosition(cluster.center);
          const pixelRadius = (cluster.radius / 100) * Math.min(dimensions.width, dimensions.height);

          return (
            <motion.div
              key={`cluster-${idx}`}
              className="absolute rounded-full cluster-blob pointer-events-none"
              style={{
                backgroundColor: cluster.color,
                width: pixelRadius * 2,
                height: pixelRadius * 2,
                left: pixelPos.x - pixelRadius,
                top: pixelPos.y - pixelRadius,
                opacity: cluster.opacity,
                filter: `blur(${pixelRadius / 3}px)`,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: cluster.opacity, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 1 }}
            />
          );
        })}
      </AnimatePresence>

      {/* Bubbles */}
      <AnimatePresence>
        {participantList.map((participant, index) => {
          const position = getPixelPosition(participant.position || { x: 50, y: 50 });
          const size = getBubbleSize(participant);
          const topCats = getTopCategories(participant);
          const colors = getGradientColors(topCats);

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
              <div
                className="rounded-full bubble-animated"
                style={{
                  width: size,
                  height: size,
                  background: colors.length >= 2
                    ? `radial-gradient(circle at 30% 30%, ${colors[0]}, ${colors[1] || colors[0]} 60%, ${colors[2] || colors[1] || colors[0]})`
                    : colors[0] || '#00F0FF',
                  boxShadow: `0 0 ${size / 5}px ${colors[0] || '#00F0FF'}40`,
                }}
              />
              <div
                className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white/80 font-medium"
                style={{ top: size + 2 }}
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
