'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainVisualization } from '@/components/dashboard/MainVisualization';
import { SharedRealityMeter } from '@/components/dashboard/SharedRealityMeter';
import { StatsPanel } from '@/components/dashboard/StatsPanel';
import { ControlBar } from '@/components/dashboard/ControlBar';
import { RevealMode } from '@/components/dashboard/RevealMode';
import {
  subscribeToSession,
  updateGameState,
  updateAllPositions,
  updateSessionStats,
  resetSession,
  setTimerEnd,
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
import { Session, GameState, Participant, ClusterInfo } from '@/types';

export default function DashboardPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<Session | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [sharedReality, setSharedReality] = useState(100);
  const [clusters, setClusters] = useState<ClusterInfo[]>([]);
  const [initialSharedReality] = useState(100);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const updateRef = useRef<NodeJS.Timeout | null>(null);

  // Subscribe to session data
  useEffect(() => {
    const unsubscribe = subscribeToSession(sessionId, (data) => {
      setSession(data);

      if (data?.config?.roundDurationSeconds) {
        // Initialize timer if in waiting state
        if (data.gameState === 'waiting') {
          setTimeRemaining(data.config.roundDurationSeconds);
        }
      }
    });

    return () => unsubscribe();
  }, [sessionId]);

  // Calculate and update stats periodically during gameplay
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
      const participantList = Object.values(participants);

      if (participantList.length < 2) return;

      // Calculate shared reality
      const reality = calculateSharedReality(participantList);
      setSharedReality(reality);

      // Calculate positions
      const positions = calculateAllPositions(participants);
      await updateAllPositions(sessionId, positions);

      // Update stats
      const totalCards = session.config?.cardsPerParticipant || 40;
      await updateSessionStats(sessionId, {
        sharedReality: reality,
        totalChoicesMade: calculateTotalChoices(participants),
        averageProgress: calculateAverageProgress(participants, totalCards),
      });
    };

    updateStats();
    updateRef.current = setInterval(updateStats, 3000);

    return () => {
      if (updateRef.current) {
        clearInterval(updateRef.current);
      }
    };
  }, [session, sessionId]);

  // Timer logic
  useEffect(() => {
    if (!session) return;

    if (session.gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Timer ended - trigger reveal
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
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [session?.gameState]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!session) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (session.gameState === 'waiting') {
            handleStart();
          } else if (session.gameState === 'playing') {
            handlePause();
          } else if (session.gameState === 'paused') {
            handleResume();
          }
          break;
        case 'KeyR':
          if (session.gameState === 'playing' || session.gameState === 'paused') {
            handleReveal();
          }
          break;
        case 'Escape':
          if (session.gameState === 'reveal' || session.gameState === 'ended') {
            handleReset();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [session?.gameState]);

  // Control handlers
  const handleStart = useCallback(async () => {
    await updateGameState(sessionId, 'playing');
    const duration = session?.config?.roundDurationSeconds || 180;
    setTimeRemaining(duration);
    await setTimerEnd(sessionId, Date.now() + duration * 1000);
  }, [sessionId, session?.config?.roundDurationSeconds]);

  const handlePause = useCallback(async () => {
    await updateGameState(sessionId, 'paused');
  }, [sessionId]);

  const handleResume = useCallback(async () => {
    await updateGameState(sessionId, 'playing');
  }, [sessionId]);

  const handleReveal = useCallback(async () => {
    await updateGameState(sessionId, 'reveal');

    // Calculate final stats and clusters
    if (session?.participants) {
      const participantList = Object.values(session.participants);
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
  }, [sessionId, session?.config?.roundDurationSeconds]);

  // Loading state
  if (!session) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-text-muted">Loading session...</p>
        </div>
      </div>
    );
  }

  const participants = session.participants || {};
  const participantList = Object.values(participants);
  const participantCount = participantList.filter((p) => p.isActive !== false).length;
  const totalChoices = calculateTotalChoices(participants);
  const avgProgress = calculateAverageProgress(
    participants,
    session.config?.cardsPerParticipant || 40
  );

  // Find most active participant
  const mostActive = participantList.reduce<{
    name: string;
    progress: string;
  } | undefined>((max, p) => {
    const choices = p.choices ? Object.values(p.choices) : [];
    const progress = choices.length;
    if (!max || progress > parseInt(max.progress)) {
      return {
        name: p.name,
        progress: `${progress}/${session.config?.cardsPerParticipant || 40}`,
      };
    }
    return max;
  }, undefined);

  // Generate join URL
  const joinUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/join/${sessionId}`
      : `/join/${sessionId}`;

  return (
    <div className="min-h-screen bg-bg-dark p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
            THE DIVERGENCE MACHINE
          </h1>
          <p className="text-text-muted mt-1">
            Session: <span className="font-mono text-primary">{sessionId}</span>
          </p>
        </header>

        {/* QR Code (shown in waiting state) */}
        <AnimatePresence>
          {session.gameState === 'waiting' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-center"
            >
              <div className="bg-white p-4 rounded-xl">
                <QRCodeSVG value={joinUrl} size={200} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Column - Stats */}
          <div className="lg:col-span-1 space-y-4">
            <SharedRealityMeter percentage={sharedReality} />
            <StatsPanel
              participantCount={participantCount}
              totalChoices={totalChoices}
              averageProgress={avgProgress}
              mostActive={mostActive}
            />
          </div>

          {/* Center Column - Visualization */}
          <div className="lg:col-span-3">
            {session.gameState === 'reveal' ? (
              <RevealMode
                initialSharedReality={initialSharedReality}
                finalSharedReality={sharedReality}
                clusters={clusters}
                participants={participants}
                mostUnique={session.stats?.mostUnique}
                mostMainstream={session.stats?.mostMainstream}
              />
            ) : (
              <div className="h-[500px] md:h-[600px]">
                <MainVisualization
                  participants={participants}
                  showClusters={session.gameState === 'reveal'}
                  clusters={clusters}
                />
              </div>
            )}
          </div>
        </div>

        {/* Control Bar */}
        <ControlBar
          gameState={session.gameState}
          timeRemaining={timeRemaining}
          onStart={handleStart}
          onPause={handlePause}
          onResume={handleResume}
          onReveal={handleReveal}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}
