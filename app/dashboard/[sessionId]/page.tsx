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
    maxParticipants: 30,
    simulationSpeed: 600,
    isSimulating: true, // Auto-start when game starts
    addingParticipants: true,
  });
  const addedCountRef = useRef(0); // Track how many we've added (never resets)
  const personalitiesRef = useRef<Record<string, string[]>>({}); // Store participant "personalities"
  const processIndexRef = useRef(0); // Rotate through participants

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

  // Category groups for personality assignment
  const categoryGroups = ['politics', 'tech', 'entertainment', 'science', 'sports', 'lifestyle', 'finance', 'animals'];

  // Assign a personality (2-3 preferred categories) to a participant
  const getOrAssignPersonality = (odId: string): string[] => {
    if (!personalitiesRef.current[odId]) {
      // Randomly pick 2-3 categories this participant will strongly prefer
      const shuffled = [...categoryGroups].sort(() => Math.random() - 0.5);
      personalitiesRef.current[odId] = shuffled.slice(0, 2 + Math.floor(Math.random() * 2));
    }
    return personalitiesRef.current[odId];
  };

  // Debug mode - simulate random participants
  useEffect(() => {
    // Run in waiting (to add users) or playing (to add users + make choices)
    const isActiveState = session?.gameState === 'waiting' || session?.gameState === 'playing';

    if (!isDebugMode || !session || !isActiveState || !debugSettings.isSimulating) {
      if (debugRef.current) {
        clearInterval(debugRef.current);
        debugRef.current = null;
      }
      return;
    }

    const simulateParticipants = async () => {
      const participants = session.participants || {};
      const currentCount = Object.keys(participants).length;

      // Add participants only if we haven't added enough yet
      // Use addedCountRef to track independently of Firebase lag
      if (debugSettings.addingParticipants && addedCountRef.current < debugSettings.maxParticipants) {
        addedCountRef.current++;
        const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Parker', 'Jamie', 'Drew', 'Blake', 'Reese', 'Skyler', 'Devon', 'Hayden', 'Emery', 'Rowan', 'Sage'];
        const randomName = names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100);
        await addParticipant(sessionId, randomName);
      }

      // Only make choices when game is actually playing
      if (session.gameState !== 'playing') return;

      // Make choices for ALL participants, rotating through them
      const participantArray = Object.values(participants);
      if (participantArray.length === 0) return;

      // Process a batch starting from rotating index (so everyone gets a turn)
      const batchSize = Math.min(10, participantArray.length);
      const startIdx = processIndexRef.current % participantArray.length;
      processIndexRef.current = (processIndexRef.current + batchSize) % Math.max(1, participantArray.length);

      for (let i = 0; i < batchSize; i++) {
        const idx = (startIdx + i) % participantArray.length;
        const participant = participantArray[idx];

        const choices = participant.choices ? Object.values(participant.choices) : [];
        // Everyone makes a choice if they haven't finished
        if (choices.length < 40) {
          const personality = getOrAssignPersonality(participant.odId);
          const unseenContent = contentPool.filter(
            (c) => !choices.some((ch: Choice) => ch.contentId === c.id)
          );

          if (unseenContent.length > 0) {
            const randomContent = unseenContent[Math.floor(Math.random() * unseenContent.length)];
            const contentCategory = randomContent.category.split('_')[0];

            // Like probability based on personality match
            // 85% like if matches personality, 15% like if doesn't
            const matchesPersonality = personality.includes(contentCategory);
            const likeChance = matchesPersonality ? 0.85 : 0.15;

            await recordChoice(sessionId, participant.odId, {
              contentId: randomContent.id,
              action: Math.random() < likeChance ? 'like' : 'skip',
              timestamp: Date.now(),
            });
          }
        }
      }
    };

    debugRef.current = setInterval(simulateParticipants, debugSettings.simulationSpeed);
    return () => {
      if (debugRef.current) clearInterval(debugRef.current);
    };
  }, [isDebugMode, session?.gameState, sessionId, debugSettings.isSimulating, debugSettings.addingParticipants, debugSettings.maxParticipants, debugSettings.simulationSpeed]);

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
    // Reset debug counters
    addedCountRef.current = 0;
    processIndexRef.current = 0;
    personalitiesRef.current = {};
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

    // Calculate fascinating facts
    const totalSwipes = session.stats?.totalChoicesMade || 0;
    const avgSwipesPerPerson = participantCount > 0 ? Math.round(totalSwipes / participantCount) : 0;

    // Category analysis
    const categoryStats: Record<string, { likes: number; skips: number; uniqueLikers: Set<string> }> = {};
    participantList.forEach((p) => {
      const choices = p.choices ? Object.values(p.choices) : [];
      choices.forEach((c: Choice) => {
        const content = contentPool.find((item) => item.id === c.contentId);
        if (content) {
          const cat = content.category.split('_')[0];
          if (!categoryStats[cat]) categoryStats[cat] = { likes: 0, skips: 0, uniqueLikers: new Set() };
          if (c.action === 'like') {
            categoryStats[cat].likes++;
            categoryStats[cat].uniqueLikers.add(p.odId);
          } else {
            categoryStats[cat].skips++;
          }
        }
      });
    });

    // Find interesting insights
    const mostPolarizing = Object.entries(categoryStats)
      .map(([cat, stats]) => ({ cat, ratio: Math.min(stats.likes, stats.skips) / Math.max(stats.likes, stats.skips, 1) }))
      .sort((a, b) => b.ratio - a.ratio)[0];

    const mostUnifying = Object.entries(categoryStats)
      .map(([cat, stats]) => ({ cat, pct: (stats.uniqueLikers.size / participantCount) * 100 }))
      .sort((a, b) => b.pct - a.pct)[0];

    const leastPopular = Object.entries(categoryStats)
      .map(([cat, stats]) => ({ cat, pct: (stats.uniqueLikers.size / participantCount) * 100 }))
      .sort((a, b) => a.pct - b.pct)[0];

    // Calculate "echo chamber strength" - how much people stayed in their lanes
    const avgCategoriesPerPerson = participantList.reduce((sum, p) => {
      const choices = p.choices ? Object.values(p.choices) : [];
      const likedCats = new Set(choices.filter((c: Choice) => c.action === 'like').map((c: Choice) => {
        const content = contentPool.find((item) => item.id === c.contentId);
        return content ? content.category.split('_')[0] : null;
      }).filter(Boolean));
      return sum + likedCats.size;
    }, 0) / Math.max(1, participantCount);

    const echoStrength = Math.round(100 - (avgCategoriesPerPerson / 8) * 100); // 8 categories

    const insights = [
      { emoji: '🔥', label: 'Split the Room', value: mostPolarizing?.cat || 'N/A', desc: 'Most divisive topic' },
      { emoji: '🤝', label: 'Common Ground', value: mostUnifying?.cat || 'N/A', desc: `${Math.round(mostUnifying?.pct || 0)}% liked it` },
      { emoji: '🙈', label: 'Ghost Town', value: leastPopular?.cat || 'N/A', desc: 'Least popular' },
      { emoji: '🫧', label: 'Echo Chamber', value: `${echoStrength}%`, desc: 'How siloed were we' },
      { emoji: '⚡', label: 'Total Swipes', value: totalSwipes.toLocaleString(), desc: `${avgSwipesPerPerson} per person` },
      { emoji: '🎯', label: 'Filter Bubbles', value: clusters.length.toString(), desc: 'Distinct groups' },
    ];

    return (
      <div className="h-screen bg-bg-dark cyber-grid overflow-hidden flex flex-col relative">
        {/* Site URL */}
        <div className="absolute top-4 left-4 z-20">
          <span className="site-url-large text-neon-blue font-mono">makeyourownbubble.com</span>
        </div>

        {/* Header */}
        <div className="p-6 text-center">
          <h1 className="projector-text-xl text-glow-cyan">BUBBLE FORMED</h1>
        </div>

        {/* Main content - side by side layout */}
        <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
          {/* Dispersing particles animation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-8 h-10 rounded bg-gradient-to-b from-white/20 to-transparent"
                style={{ backgroundColor: particle.color, boxShadow: `0 0 10px ${particle.color}` }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 1, rotate: 0 }}
                animate={{ x: particle.x, y: particle.y, opacity: [0, 1, 1, 0], scale: [1, 1, 0.5, 0], rotate: (Math.random() - 0.5) * 180 }}
                transition={{ duration: 2.5, delay: 1.5 + particle.delay, ease: 'easeOut' }}
              />
            ))}
          </div>

          <div className="flex items-center gap-16 relative z-10 max-w-6xl w-full">
            {/* Left side - Main percentage */}
            <div className="flex-1 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }} className="mb-4">
                <p className="text-text-muted text-lg mb-1">Started with</p>
                <p className="text-6xl font-black text-glow-green text-neon-green">100%</p>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-2xl text-text-muted mb-4">
                ↓
              </motion.div>

              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10, delay: 1.2 }}>
                <p className="text-text-muted text-lg mb-1">Ended with</p>
                <p className={`text-7xl font-black ${sharedReality < 40 ? 'text-glow-pink text-neon-pink' : 'text-glow-cyan text-warning'}`}>
                  {sharedReality}%
                </p>
                <p className="text-text-muted text-sm mt-2">shared reality</p>
              </motion.div>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="mt-6 text-lg text-text-muted">
                <span className="text-neon-blue">{participantCount}</span> people → <span className="text-neon-pink">{clusters.length}</span> bubbles
              </motion.p>
            </div>

            {/* Divider */}
            <motion.div
              className="w-px h-80 bg-gradient-to-b from-transparent via-neon-blue/50 to-transparent"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            />

            {/* Right side - Insights grid */}
            <div className="flex-1">
              <motion.p
                className="text-text-muted text-sm uppercase tracking-wider mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
              >
                What Happened
              </motion.p>
              <div className="grid grid-cols-2 gap-3">
                {insights.map((insight, idx) => (
                  <motion.div
                    key={insight.label}
                    className="bg-bg-card/60 p-4 border-l-2 border-neon-blue/30"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2 + idx * 0.1 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{insight.emoji}</span>
                      <span className="text-text-muted text-xs uppercase">{insight.label}</span>
                    </div>
                    <p className="text-xl font-bold text-white capitalize">{insight.value}</p>
                    <p className="text-text-muted text-xs">{insight.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
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
        <span className="site-url-large text-neon-blue font-mono">makeyourownbubble.com</span>
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
        <div className="absolute bottom-28 left-4 bg-bg-card/95 border border-warning text-warning p-4 font-mono text-sm space-y-3 min-w-[240px]">
          <div className="text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            Debug Controls
          </div>

          {/* Main simulation toggle - big button */}
          <button
            onClick={() => setDebugSettings(s => ({ ...s, isSimulating: !s.isSimulating }))}
            className={`w-full py-3 text-sm font-bold uppercase tracking-wider transition-all ${
              debugSettings.isSimulating
                ? 'bg-neon-green/20 text-neon-green border border-neon-green/50'
                : 'bg-neon-pink/20 text-neon-pink border border-neon-pink/50'
            }`}
          >
            {debugSettings.isSimulating ? '⏸ PAUSE SWIPING' : '▶ START SWIPING'}
          </button>

          <div className="flex items-center justify-between gap-4">
            <span className="text-text-muted text-xs">Add New Users</span>
            <button
              onClick={() => setDebugSettings(s => ({ ...s, addingParticipants: !s.addingParticipants }))}
              className={`px-2 py-1 text-xs ${debugSettings.addingParticipants ? 'bg-neon-blue/20 text-neon-blue' : 'bg-bg-dark text-text-muted'}`}
            >
              {debugSettings.addingParticipants ? 'ON' : 'OFF'}
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
                onClick={() => setDebugSettings(s => ({ ...s, simulationSpeed: Math.min(2000, s.simulationSpeed + 200) }))}
                className="px-2 py-1 text-xs bg-bg-dark hover:bg-neon-blue/20"
              >
                ◀
              </button>
              <span className="w-12 text-center">{debugSettings.simulationSpeed}</span>
              <button
                onClick={() => setDebugSettings(s => ({ ...s, simulationSpeed: Math.max(200, s.simulationSpeed - 200) }))}
                className="px-2 py-1 text-xs bg-bg-dark hover:bg-neon-blue/20"
              >
                ▶
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-warning/30 text-text-muted text-xs flex justify-between">
            <span>{participantCount} users</span>
            <span>{session?.stats?.totalChoicesMade || 0} swipes</span>
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
