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
    simulationSpeed: 200,
    isSimulating: true, // Auto-start when game starts
    addingParticipants: true,
  });
  const addedCountRef = useRef(0); // Track how many we've added (never resets)
  const personalitiesRef = useRef<Record<string, string[]>>({}); // Store participant "personalities"
  const processIndexRef = useRef(0); // Rotate through participants
  const sessionRef = useRef<Session | null>(null); // Always have fresh session data

  // Keep sessionRef updated
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

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
      // IMPORTANT: Use ref to get fresh session data, not stale closure
      const currentSession = sessionRef.current;
      if (!currentSession) return;

      const participants = currentSession.participants || {};

      // Add participants only if we haven't added enough yet
      if (debugSettings.addingParticipants && addedCountRef.current < debugSettings.maxParticipants) {
        addedCountRef.current++;
        const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Parker', 'Jamie', 'Drew', 'Blake', 'Reese', 'Skyler', 'Devon', 'Hayden', 'Emery', 'Rowan', 'Sage'];
        const randomName = names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100);
        await addParticipant(sessionId, randomName);
      }

      // Only make choices when game is actually playing
      if (currentSession.gameState !== 'playing') return;

      // Make choices for a random subset of participants each tick
      const participantArray = Object.values(participants);
      if (participantArray.length === 0) return;

      // Each tick, randomly pick ~30% of participants to swipe (simulates natural staggering)
      const activePool = participantArray.filter((p) => {
        const choices = p.choices ? Object.values(p.choices) : [];
        return choices.length < 40;
      });

      // Shuffle and pick a random subset
      const shuffled = [...activePool].sort(() => Math.random() - 0.5);
      const batchSize = Math.max(1, Math.ceil(shuffled.length * 0.3));
      const batch = shuffled.slice(0, batchSize);

      for (const participant of batch) {
        const choices = participant.choices ? Object.values(participant.choices) : [];
        const personality = getOrAssignPersonality(participant.odId);
        const unseenContent = contentPool.filter(
          (c) => !choices.some((ch: Choice) => ch.contentId === c.id)
        );

        if (unseenContent.length > 0) {
          const randomContent = unseenContent[Math.floor(Math.random() * unseenContent.length)];
          const contentCategory = randomContent.category.split('_')[0];

          // Like probability based on personality match
          const matchesPersonality = personality.includes(contentCategory);
          const likeChance = matchesPersonality ? 0.85 : 0.15;

          await recordChoice(sessionId, participant.odId, {
            contentId: randomContent.id,
            action: Math.random() < likeChance ? 'like' : 'skip',
            timestamp: Date.now(),
          });
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

    // === Compute reveal insights ===

    // Per-person category breakdown
    const personProfiles = participantList.map((p) => {
      const choices = p.choices ? Object.values(p.choices) : [];
      const likes = choices.filter((c: Choice) => c.action === 'like');
      const catCounts: Record<string, number> = {};
      const seenCats = new Set<string>();
      for (const c of likes) {
        const content = contentPool.find((item) => item.id === c.contentId);
        if (content) {
          const cat = content.category.split('_')[0];
          catCounts[cat] = (catCounts[cat] || 0) + 1;
          seenCats.add(cat);
        }
      }
      const sorted = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
      const topCat = sorted[0]?.[0] || '';
      const topCount = sorted[0]?.[1] || 0;
      const concentration = likes.length > 0 ? Math.round((topCount / likes.length) * 100) : 0;
      return { name: p.name, odId: p.odId, topCat, concentration, catCounts, seenCats, totalLikes: likes.length, totalChoices: choices.length };
    });

    // 1. Most Trapped — person with the highest % in one category
    const mostTrapped = [...personProfiles].sort((a, b) => b.concentration - a.concentration)[0];

    // 2. Worlds Apart — find the two most different people (lowest cosine similarity on category vectors)
    const allCatGroups = ['politics', 'tech', 'entertainment', 'science', 'sports', 'lifestyle', 'finance', 'animals'];
    let worldsApartA = '', worldsApartB = '', lowestSim = 1;
    for (let i = 0; i < personProfiles.length; i++) {
      for (let j = i + 1; j < personProfiles.length; j++) {
        const vecA = allCatGroups.map(c => personProfiles[i].catCounts[c] || 0);
        const vecB = allCatGroups.map(c => personProfiles[j].catCounts[c] || 0);
        const magA = Math.sqrt(vecA.reduce((s, v) => s + v * v, 0));
        const magB = Math.sqrt(vecB.reduce((s, v) => s + v * v, 0));
        const dot = vecA.reduce((s, v, k) => s + v * vecB[k], 0);
        const sim = (magA > 0 && magB > 0) ? dot / (magA * magB) : 1;
        if (sim < lowestSim) {
          lowestSim = sim;
          worldsApartA = personProfiles[i].name;
          worldsApartB = personProfiles[j].name;
        }
      }
    }

    // 3. Invisible Content — how many categories does the average person never see
    const avgCatsSeen = personProfiles.reduce((s, p) => s + p.seenCats.size, 0) / Math.max(1, personProfiles.length);
    const avgCatsMissed = Math.round(8 - avgCatsSeen);

    // 4. The biggest bubble — most common dominant category
    const bubbleCounts: Record<string, number> = {};
    for (const p of personProfiles) {
      if (p.topCat) bubbleCounts[p.topCat] = (bubbleCounts[p.topCat] || 0) + 1;
    }
    const biggestBubble = Object.entries(bubbleCounts).sort((a, b) => b[1] - a[1])[0];
    const biggestBubblePct = biggestBubble ? Math.round((biggestBubble[1] / personProfiles.length) * 100) : 0;

    // 5. The Narrowing — compare category diversity of first half vs second half of choices
    let avgFirstHalfCats = 0, avgSecondHalfCats = 0;
    const profilesWithEnoughData = personProfiles.filter(p => p.totalChoices >= 10);
    for (const p of profilesWithEnoughData) {
      const choices = (p as { name: string; odId: string })?.odId
        ? Object.values(participantList.find(pp => pp.odId === (p as { odId: string }).odId)?.choices || {}) as Choice[]
        : [];
      const likes = choices.filter((c: Choice) => c.action === 'like');
      const half = Math.floor(likes.length / 2);
      const firstHalf = likes.slice(0, half);
      const secondHalf = likes.slice(half);
      const firstCats = new Set(firstHalf.map((c: Choice) => {
        const ct = contentPool.find(item => item.id === c.contentId);
        return ct ? ct.category.split('_')[0] : '';
      }).filter(Boolean));
      const secondCats = new Set(secondHalf.map((c: Choice) => {
        const ct = contentPool.find(item => item.id === c.contentId);
        return ct ? ct.category.split('_')[0] : '';
      }).filter(Boolean));
      avgFirstHalfCats += firstCats.size;
      avgSecondHalfCats += secondCats.size;
    }
    const numProfiles = Math.max(1, profilesWithEnoughData.length);
    avgFirstHalfCats = Math.round((avgFirstHalfCats / numProfiles) * 10) / 10;
    avgSecondHalfCats = Math.round((avgSecondHalfCats / numProfiles) * 10) / 10;
    const narrowingHappened = avgSecondHalfCats < avgFirstHalfCats;

    // 6. Most Free — person who escaped the bubble most (most diverse)
    const mostFree = [...personProfiles].filter(p => p.totalLikes > 3).sort((a, b) => a.concentration - b.concentration)[0];

    // 7. Zero in Common — pairs with literally zero shared liked content
    const allSeenSets = participantList.map((p) => {
      const choices = p.choices ? Object.values(p.choices) : [];
      return new Set(choices.filter((c: Choice) => c.action === 'like').map((c: Choice) => c.contentId));
    });
    let zeroPairs = 0, totalPairs = 0;
    for (let i = 0; i < allSeenSets.length; i++) {
      for (let j = i + 1; j < allSeenSets.length; j++) {
        totalPairs++;
        let shared = false;
        for (const id of allSeenSets[i]) {
          if (allSeenSets[j].has(id)) { shared = true; break; }
        }
        if (!shared && allSeenSets[i].size > 0 && allSeenSets[j].size > 0) zeroPairs++;
      }
    }
    const zeroPairsPct = totalPairs > 0 ? Math.round((zeroPairs / totalPairs) * 100) : 0;

    // 8. The Rabbit Hole — what % of the last 10 cards were from a person's #1 category (avg)
    let rabbitHoleAvg = 0;
    const rabbitHoleProfiles = personProfiles.filter(p => p.totalChoices >= 15);
    for (const p of rabbitHoleProfiles) {
      const choices = Object.values(participantList.find(pp => pp.odId === p.odId)?.choices || {}) as Choice[];
      const lastN = choices.slice(-10);
      const lastLikes = lastN.filter((c: Choice) => c.action === 'like');
      const topInLast = lastLikes.filter((c: Choice) => {
        const ct = contentPool.find(item => item.id === c.contentId);
        return ct ? ct.category.split('_')[0] === p.topCat : false;
      }).length;
      rabbitHoleAvg += lastN.length > 0 ? topInLast / lastN.length : 0;
    }
    rabbitHoleAvg = rabbitHoleProfiles.length > 0 ? Math.round((rabbitHoleAvg / rabbitHoleProfiles.length) * 100) : 0;

    // 9. Echo Chamber — % of people whose top category dominated >50% of their feed
    const echoChamberCount = personProfiles.filter(p => p.concentration > 50 && p.totalLikes >= 5).length;
    const echoChamberPct = personProfiles.length > 0 ? Math.round((echoChamberCount / personProfiles.length) * 100) : 0;

    // Worlds Apart overlap %
    const overlapPct = Math.round(lowestSim * 100);

    // Category color mapping for cluster badges
    const categoryColorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
      politics: { bg: 'bg-[#FF0055]/15', text: 'text-[#FF0055]', border: 'border-[#FF0055]/40', glow: '0 0 20px #FF005540' },
      tech: { bg: 'bg-[#00F0FF]/15', text: 'text-[#00F0FF]', border: 'border-[#00F0FF]/40', glow: '0 0 20px #00F0FF40' },
      entertainment: { bg: 'bg-[#FF00E5]/15', text: 'text-[#FF00E5]', border: 'border-[#FF00E5]/40', glow: '0 0 20px #FF00E540' },
      science: { bg: 'bg-[#39FF14]/15', text: 'text-[#39FF14]', border: 'border-[#39FF14]/40', glow: '0 0 20px #39FF1440' },
      sports: { bg: 'bg-[#FF6B00]/15', text: 'text-[#FF6B00]', border: 'border-[#FF6B00]/40', glow: '0 0 20px #FF6B0040' },
      lifestyle: { bg: 'bg-[#BF00FF]/15', text: 'text-[#BF00FF]', border: 'border-[#BF00FF]/40', glow: '0 0 20px #BF00FF40' },
      finance: { bg: 'bg-[#FFE500]/15', text: 'text-[#FFE500]', border: 'border-[#FFE500]/40', glow: '0 0 20px #FFE50040' },
      animals: { bg: 'bg-[#FF8800]/15', text: 'text-[#FF8800]', border: 'border-[#FF8800]/40', glow: '0 0 20px #FF880040' },
    };

    const insights = [
      {
        label: 'DEEPEST BUBBLE',
        value: mostTrapped?.name || '—',
        desc: `${mostTrapped?.concentration || 0}% of their feed was ${mostTrapped?.topCat || '?'}`,
        accent: '#FF0055',
      },
      {
        label: 'MOST FREE',
        value: mostFree?.name || '—',
        desc: mostFree ? `Only ${mostFree.concentration}% in one topic` : 'Nobody escaped',
        accent: '#39FF14',
      },
      {
        label: 'WORLDS APART',
        value: worldsApartA && worldsApartB ? `${worldsApartA} & ${worldsApartB}` : '—',
        desc: `Only ${overlapPct}% overlap — same app, different reality`,
        accent: '#00F0FF',
      },
      narrowingHappened
        ? {
            label: 'THE NARROWING',
            value: `${avgFirstHalfCats} → ${avgSecondHalfCats}`,
            desc: 'Topics seen: start vs end of feed',
            accent: '#FF6B00',
          }
        : {
            label: 'ECHO CHAMBER',
            value: `${echoChamberPct}%`,
            desc: 'of people had >50% of their feed in one topic',
            accent: '#FF6B00',
          },
      {
        label: 'BIGGEST BUBBLE',
        value: biggestBubble ? biggestBubble[0] : '—',
        desc: biggestBubble ? `${biggestBubblePct}% of the room trapped here` : '',
        accent: '#BF00FF',
      },
      {
        label: 'INVISIBLE TOPICS',
        value: `${avgCatsMissed} of 8`,
        desc: 'Categories the average person never saw',
        accent: '#FFE500',
      },
      {
        label: 'ZERO IN COMMON',
        value: `${zeroPairsPct}%`,
        desc: 'of people pairs shared no liked content',
        accent: '#FF00E5',
      },
      {
        label: 'THE RABBIT HOLE',
        value: `${rabbitHoleAvg}%`,
        desc: 'of your last 10 cards were your #1 topic',
        accent: '#00FF88',
      },
      {
        label: 'ECHO CHAMBER',
        value: `${echoChamberPct}%`,
        desc: 'of people had >50% of feed in one topic',
        accent: '#FF4488',
      },
    ];

    // If narrowing happened, we already show it in slot 4, so replace the duplicate echo chamber
    // If narrowing didn't happen, slot 4 is echo chamber, so slot 9 becomes THE NARROWING (shows no change)
    if (!narrowingHappened) {
      insights[8] = {
        label: 'TOTAL SWIPES',
        value: (session.stats?.totalChoicesMade || 0).toLocaleString(),
        desc: `${participantCount > 0 ? Math.round((session.stats?.totalChoicesMade || 0) / participantCount) : 0} per person`,
        accent: '#FF4488',
      };
    }

    return (
      <div className="h-screen bg-bg-dark overflow-hidden flex flex-col relative">
        {/* Ambient background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#FF0055]/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#00F0FF]/8 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#BF00FF]/5 rounded-full blur-[150px]" />
        </div>

        {/* Dispersing particles animation */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-10">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-8 h-10 rounded"
              style={{ backgroundColor: particle.color, boxShadow: `0 0 15px ${particle.color}` }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 1, rotate: 0 }}
              animate={{ x: particle.x, y: particle.y, opacity: [0, 1, 1, 0], scale: [1, 1.2, 0.5, 0], rotate: (Math.random() - 0.5) * 180 }}
              transition={{ duration: 2.5, delay: 0.5 + particle.delay, ease: 'easeOut' }}
            />
          ))}
        </div>

        {/* Phase 1: Big percentage reveal — fades out after 4s */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3.5, duration: 0.8 }}
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }} className="mb-4">
              <p className="text-text-muted text-2xl mb-2 font-mono uppercase tracking-wider">Shared reality started at</p>
              <p className="text-[120px] leading-none font-black text-glow-green text-neon-green">100%</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: 0.8, duration: 0.5 }} className="text-4xl text-text-muted mb-4">
              ↓
            </motion.div>

            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10, delay: 1.5 }}>
              <p className="text-text-muted text-2xl mb-2 font-mono uppercase tracking-wider">Now it&apos;s</p>
              <p className={`text-[150px] leading-none font-black ${sharedReality < 40 ? 'text-glow-pink text-neon-pink' : 'text-glow-cyan text-warning'}`}>
                {sharedReality}%
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="mt-8 flex items-center justify-center gap-6 text-2xl">
              <span className="text-text-muted font-mono">
                <span className="text-neon-blue font-bold">{participantCount}</span> people
              </span>
              <span className="text-text-muted">→</span>
              <span className="text-text-muted font-mono">
                <span className="text-neon-pink font-bold">{clusters.length}</span> {clusters.length === 1 ? 'bubble' : 'bubbles'}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Phase 2: Projector-optimized reveal — big, bold, colorful */}
        <motion.div
          className="flex-1 flex flex-col relative z-15"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.3, duration: 0.6 }}
        >
          {/* Header */}
          <motion.div
            className="pt-6 pb-2 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.5, duration: 0.5 }}
          >
            <h1 className="text-5xl font-black uppercase tracking-wider">
              <span className="text-glow-cyan text-white">WHAT THE ALGORITHM DID</span>
            </h1>
            <div className="flex items-center justify-center gap-4 mt-3">
              <span className="text-xl font-mono text-neon-blue">{participantCount} people</span>
              <span className="text-xl text-text-muted">→</span>
              <span className="text-xl font-mono text-neon-pink">{clusters.length} bubbles</span>
              <span className="text-xl text-text-muted">→</span>
              <span className={`text-xl font-mono font-bold ${sharedReality < 40 ? 'text-neon-pink' : 'text-warning'}`}>
                {sharedReality}% shared reality
              </span>
            </div>
          </motion.div>

          {/* Insight cards — 2×3 grid, large and colorful */}
          <div className="flex-1 flex items-center justify-center px-8">
            <div className="w-full max-w-7xl">
              <div className="grid grid-cols-3 gap-5">
                {insights.map((insight, idx) => (
                  <motion.div
                    key={insight.label}
                    className="relative overflow-hidden rounded-sm"
                    style={{
                      background: `linear-gradient(135deg, ${insight.accent}18 0%, transparent 60%)`,
                      borderTop: `4px solid ${insight.accent}`,
                      boxShadow: `0 0 30px ${insight.accent}15`,
                    }}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 4.6 + idx * 0.12, type: 'spring', damping: 20 }}
                  >
                    <div className="p-6">
                      <span
                        className="text-sm font-mono uppercase tracking-[0.2em] font-bold"
                        style={{ color: insight.accent }}
                      >
                        {insight.label}
                      </span>
                      <p className="text-4xl font-black text-white mt-3 capitalize leading-tight">
                        {insight.value}
                      </p>
                      <p className="text-lg text-text-muted mt-2">
                        {insight.desc}
                      </p>
                    </div>
                    {/* Decorative accent line */}
                    <div
                      className="absolute bottom-0 left-0 h-1 w-full opacity-30"
                      style={{ background: `linear-gradient(to right, ${insight.accent}, transparent)` }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Bubbles that formed — prominent section */}
              {clusters.length > 0 && (
                <motion.div
                  className="mt-5 rounded-sm overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%)',
                    borderTop: '4px solid rgba(255,255,255,0.2)',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 5.4, type: 'spring', damping: 20 }}
                >
                  <div className="p-6">
                    <span className="text-sm font-mono uppercase tracking-[0.2em] text-text-muted font-bold">
                      THE BUBBLES THAT FORMED
                    </span>
                    <div className="flex flex-wrap gap-4 mt-4">
                      {clusters.map((cluster, idx) => {
                        const catColor = categoryColorMap[cluster.dominantCategories[0]] || categoryColorMap.tech;
                        const topicList = cluster.dominantCategories.slice(0, 3).join(', ');
                        return (
                          <motion.div
                            key={cluster.id}
                            className={`px-6 py-3 rounded-sm border ${catColor.border} ${catColor.bg}`}
                            style={{ boxShadow: catColor.glow }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 5.5 + idx * 0.1 }}
                          >
                            <span className={`font-black text-2xl ${catColor.text}`}>{cluster.label}</span>
                            <span className="text-text-muted text-lg ml-3">{cluster.memberIds.length} people</span>
                            <span className="text-text-muted text-sm ml-2 capitalize">({topicList})</span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Reset button */}
        <motion.div
          className="p-4 text-center relative z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 6 }}
        >
          <button
            onClick={handleReset}
            className="px-12 py-3 bg-bg-card/50 border border-text-muted/30 text-text-muted font-mono text-sm
                     uppercase tracking-wider hover:border-neon-blue hover:text-neon-blue transition-all"
          >
            press ESC to reset
          </button>
        </motion.div>
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
    const threshold = 35; // Distance threshold for clustering (positions are spread wide)
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
