'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  sessionExists,
  addParticipant,
  recordChoice,
  subscribeToGameState,
  subscribeToParticipantCount,
} from '@/lib/firebase';
import { getNextRecommendedCard, contentPool, getCategoryGroup, getCategoryColor } from '@/lib/content';
import { ContentItem, Choice, GameState } from '@/types';

type Screen = 'join' | 'waiting' | 'playing' | 'complete';

const TOTAL_CARDS = 40;

export default function JoinPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [screen, setScreen] = useState<Screen>('join');
  const [name, setName] = useState('');
  const [odId, setOdId] = useState('');
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [participantCount, setParticipantCount] = useState(0);
  const [currentCard, setCurrentCard] = useState<ContentItem | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const [pastChoices, setPastChoices] = useState<{ contentId: string; action: 'like' | 'skip' }[]>([]);
  const [cardCount, setCardCount] = useState(0);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  // Dopamine feedback state
  const [toast, setToast] = useState<{ message: string; color: string; id: number; big?: boolean } | null>(null);
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [screenGlow, setScreenGlow] = useState<string | null>(null);
  const [streak, setStreak] = useState(0); // positive = likes, negative = skips
  const streakRef = useRef({ likes: 0, skips: 0 });
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const glowTimerRef = useRef<NodeJS.Timeout | null>(null);
  const likeCountRef = useRef(0);

  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const showToast = useCallback((message: string, color: string, big = false) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, color, id: Date.now(), big });
    toastTimerRef.current = setTimeout(() => setToast(null), big ? 2800 : 2000);
    // Screen glow for big moments
    if (big) {
      if (glowTimerRef.current) clearTimeout(glowTimerRef.current);
      setScreenGlow(color);
      glowTimerRef.current = setTimeout(() => setScreenGlow(null), 1200);
    }
  }, []);

  const spawnEmoji = useCallback((emoji: string) => {
    const id = Date.now() + Math.random();
    const x = 30 + Math.random() * 40; // 30-70% from left
    setFloatingEmojis(prev => [...prev, { id, emoji, x }]);
    setTimeout(() => setFloatingEmojis(prev => prev.filter(e => e.id !== id)), 1500);
  }, []);

  // Get the first recommended card on mount
  useEffect(() => {
    const firstCard = getNextRecommendedCard([], new Set());
    if (firstCard) {
      setCurrentCard(firstCard);
      seenIdsRef.current.add(firstCard.id);
    }
  }, []);

  // Subscribe to game state
  useEffect(() => {
    if (!odId) return;
    const unsubscribe = subscribeToGameState(sessionId, (state) => {
      setGameState(state);
      if (state === 'playing' && screen === 'waiting') {
        setScreen('playing');
      }
      if ((state === 'reveal' || state === 'ended') && screen === 'playing') {
        setScreen('complete');
      }
    });
    return () => unsubscribe();
  }, [sessionId, odId, screen]);

  // Subscribe to participant count
  useEffect(() => {
    const unsubscribe = subscribeToParticipantCount(sessionId, setParticipantCount);
    return () => unsubscribe();
  }, [sessionId]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.length < 2) return;

    setIsJoining(true);
    setError('');

    try {
      const exists = await sessionExists(sessionId);
      if (!exists) {
        setError('Session not found');
        setIsJoining(false);
        return;
      }
      const participantId = await addParticipant(sessionId, name.trim());
      setOdId(participantId);
      setScreen('waiting');
    } catch (err) {
      setError('Failed to join');
      console.error(err);
    } finally {
      setIsJoining(false);
    }
  };

  const handleChoice = useCallback(
    async (action: 'like' | 'skip') => {
      if (!currentCard) return;

      // Record the past choice for the recommendation algorithm
      const newPastChoice = { contentId: currentCard.id, action };
      const updatedPastChoices = [...pastChoices, newPastChoice];
      setPastChoices(updatedPastChoices);

      // Record the full choice for Firebase and stats
      const choice: Choice = { contentId: currentCard.id, action, timestamp: Date.now() };
      setChoices((prev: Choice[]) => [...prev, choice]);

      try {
        const nextCardCount = cardCount + 1;
        await recordChoice(sessionId, odId, choice, nextCardCount);
      } catch (error) {
        console.error('Failed to record:', error);
      }

      const newCardCount = cardCount + 1;
      setCardCount(newCardCount);

      // Dopamine feedback — streaks + milestones + emojis
      if (action === 'like') {
        streakRef.current.likes++;
        streakRef.current.skips = 0;
        likeCountRef.current++;
        // Floating emoji on like
        if (Math.random() < 0.4) spawnEmoji(pick(['✨', '🔥', '⚡', '💫', '🌟']));
      } else {
        streakRef.current.skips++;
        streakRef.current.likes = 0;
        if (Math.random() < 0.3) spawnEmoji(pick(['👀', '🤔', '💨', '🫣']));
      }
      setStreak(action === 'like' ? streakRef.current.likes : -streakRef.current.skips);

      const ls = streakRef.current.likes;
      const ss = streakRef.current.skips;
      const totalLikes = likeCountRef.current;

      // Like streak toasts (highest priority) — big visual for 5+
      if (ls === 10) { showToast('10 STRAIGHT — LEGENDARY!', '#FFE500', true); spawnEmoji('👑'); }
      else if (ls === 7) { showToast(pick(["ALGORITHM'S DREAM!", "CAN'T STOP WON'T STOP!"]), '#FF00E5', true); spawnEmoji('🔥'); }
      else if (ls === 5) { showToast(pick(['HOOKED!', 'FIVE STREAK!', 'UNSTOPPABLE!']), '#FF00E5', true); spawnEmoji('⚡'); }
      else if (ls === 3) showToast(pick(['On a roll!', 'Triple like!', 'Hat trick!']), '#39FF14');
      // Skip streak toasts
      else if (ss === 7) { showToast('UNTAMEABLE!', '#00F0FF', true); spawnEmoji('🦁'); }
      else if (ss === 5) { showToast(pick(['REBEL!', 'Fighting the feed!', 'Algorithm hates this!']), '#00F0FF', true); spawnEmoji('✊'); }
      else if (ss === 3) showToast(pick(['Picky picky...', 'Not impressed?', 'Breaking free?']), '#00F0FF');
      // Like count milestones
      else if (totalLikes === 25) { showToast('25 likes! Full bubble mode', '#BF00FF', true); spawnEmoji('🫧'); }
      else if (totalLikes === 20) showToast(pick(['20 likes — feeding the machine!', '20 likes! The bubble thickens']), '#FF6B00');
      else if (totalLikes === 15) showToast('15 likes! Deep in the bubble', '#FF00E5');
      else if (totalLikes === 10) showToast(pick(['Double digits! The algorithm loves you', '10 likes — your bubble is real']), '#FF00E5');
      else if (totalLikes === 5) showToast(pick(["5 likes! You've got taste", 'The algorithm is learning you']), '#39FF14');
      // Card count milestones
      else if (newCardCount === 38) showToast('Final stretch!', '#FF0055');
      else if (newCardCount === 35) showToast(pick(['Almost done — can you escape?', 'The walls are closing in']), '#FF0055');
      else if (newCardCount === 30) showToast(pick(['Echo echo echo...', 'Your bubble is getting thicker']), '#BF00FF');
      else if (newCardCount === 28) showToast('Can you even see outside?', '#FF6B00');
      else if (newCardCount === 25) showToast('The algorithm knows your type', '#FF6B00');
      else if (newCardCount === 23) showToast('Your feed ≠ their feed', '#FFE500');
      else if (newCardCount === 20) { showToast('Halfway! You\'re in deep', '#FFE500', true); spawnEmoji('🫧'); }
      else if (newCardCount === 18) showToast('The feed is adapting to you', '#FF00E5');
      else if (newCardCount === 15) showToast('Patterns detected!', '#FF00E5');
      else if (newCardCount === 13) showToast('Your data is being collected', '#00F0FF');
      else if (newCardCount === 10) showToast('Your bubble is forming!', '#00F0FF');
      else if (newCardCount === 8) showToast('The algorithm is watching...', '#39FF14');
      else if (newCardCount === 5) showToast(pick(['And so it begins...', 'First impressions count!']), '#39FF14');
      else if (newCardCount === 3) showToast('Swipe swipe swipe!', '#39FF14');

      // After TOTAL_CARDS, go to complete screen
      if (newCardCount >= TOTAL_CARDS) {
        setCurrentCard(null);
        setScreen('complete');
        return;
      }

      // Get the next recommended card based on all past choices
      const nextCard = getNextRecommendedCard(updatedPastChoices, seenIdsRef.current);
      if (nextCard) {
        seenIdsRef.current.add(nextCard.id);
        setCurrentCard(nextCard);
      } else {
        // No more unseen content available
        setCurrentCard(null);
        setScreen('complete');
      }
    },
    [sessionId, odId, currentCard, pastChoices, cardCount, showToast, spawnEmoji]
  );

  const topCategories = useMemo(() => {
    const categoryCount: Record<string, number> = {};
    for (const choice of pastChoices.filter((c) => c.action === 'like')) {
      const content = contentPool.find((c) => c.id === choice.contentId);
      if (content) {
        const group = getCategoryGroup(content.category);
        categoryCount[group] = (categoryCount[group] || 0) + 1;
      }
    }
    return Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat]) => cat);
  }, [pastChoices]);

  const categoryInfo: Record<string, { name: string; emoji: string }> = {
    politics: { name: 'Politics', emoji: '📰' },
    tech: { name: 'Technology', emoji: '💻' },
    entertainment: { name: 'Entertainment', emoji: '🎬' },
    science: { name: 'Science', emoji: '🔬' },
    sports: { name: 'Sports', emoji: '⚽' },
    lifestyle: { name: 'Lifestyle', emoji: '✨' },
    finance: { name: 'Finance', emoji: '💰' },
    animals: { name: 'Animals', emoji: '🐾' },
  };

  // ── Personalized insights computed from swipe data ──
  const insights = useMemo(() => {
    const allGroups = ['politics', 'tech', 'entertainment', 'science', 'sports', 'lifestyle', 'finance', 'animals'];

    // Category distribution of likes
    const likeCounts: Record<string, number> = {};
    const seenCounts: Record<string, number> = {};
    let totalLikes = 0;

    for (const c of pastChoices) {
      const item = contentPool.find(x => x.id === c.contentId);
      if (!item) continue;
      const group = getCategoryGroup(item.category);
      seenCounts[group] = (seenCounts[group] || 0) + 1;
      if (c.action === 'like') {
        likeCounts[group] = (likeCounts[group] || 0) + 1;
        totalLikes++;
      }
    }

    // Feed breakdown: sorted by like count
    const feedBreakdown = Object.entries(likeCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count]) => ({
        category: cat,
        count,
        percent: totalLikes > 0 ? Math.round((count / totalLikes) * 100) : 0,
      }));

    // Blind spots: categories with 0 likes
    const blindSpots = allGroups.filter(g => !likeCounts[g] || likeCounts[g] === 0);

    // Diversity score: how many categories they liked out of 8
    const diversityCount = allGroups.filter(g => (likeCounts[g] || 0) > 0).length;

    // Predictability: find when the algorithm "figured them out"
    // Check from card 8 onward: when did 70%+ of remaining served cards
    // match the user's top 2 categories?
    const top2 = feedBreakdown.slice(0, 2).map(f => f.category);
    let figuredOutAt = pastChoices.length; // default: never
    for (let i = 8; i < pastChoices.length - 3; i++) {
      const remaining = pastChoices.slice(i);
      const matchCount = remaining.filter(c => {
        const item = contentPool.find(x => x.id === c.contentId);
        if (!item) return false;
        return top2.includes(getCategoryGroup(item.category));
      }).length;
      if (matchCount / remaining.length >= 0.7) {
        figuredOutAt = i;
        break;
      }
    }

    // Algorithm accuracy: of cards served after figuredOutAt, what % did they like?
    const postProfile = pastChoices.slice(figuredOutAt);
    const postLikes = postProfile.filter(c => c.action === 'like').length;
    const algorithmAccuracy = postProfile.length > 0
      ? Math.round((postLikes / postProfile.length) * 100)
      : 0;

    // Social media match
    const topCat = feedBreakdown[0]?.category || 'tech';
    const secondCat = feedBreakdown[1]?.category;
    const socialMediaMap: Record<string, { platform: string; reason: string }> = {
      politics: { platform: 'Twitter / X', reason: 'Where the debates never end' },
      tech: { platform: 'Reddit', reason: 'Deep dives and hot takes on everything new' },
      entertainment: { platform: 'TikTok', reason: 'Endless scroll of exactly what you love' },
      science: { platform: 'YouTube', reason: 'Long-form rabbit holes await you' },
      sports: { platform: 'ESPN App', reason: 'Scores, highlights, and hot takes 24/7' },
      lifestyle: { platform: 'Instagram', reason: 'Aesthetic feeds curated just for you' },
      finance: { platform: 'Bloomberg', reason: 'Numbers, charts, and market analysis' },
      animals: { platform: 'TikTok', reason: 'Cute animal compilations forever' },
    };
    const socialMatch = socialMediaMap[topCat] || socialMediaMap.tech;

    // Rabbit hole prediction
    const rabbitHoleMap: Record<string, string[]> = {
      politics: ['political commentary compilations', 'debate reaction videos', 'election analysis deep dives'],
      tech: ['AI documentaries at 2am', '"how it works" explainers', 'tech startup stories'],
      entertainment: ['celebrity interviews', 'movie theory videos', 'behind-the-scenes content'],
      science: ['space exploration documentaries', 'science experiment compilations', '"what would happen if" videos'],
      sports: ['greatest plays compilations', 'athlete comeback stories', 'sports analytics breakdowns'],
      lifestyle: ['productivity routines', 'travel vlogs', 'cooking challenge videos'],
      finance: ['crypto analysis at midnight', 'investing strategy breakdowns', 'market crash documentaries'],
      animals: ['baby animal compilations', 'wildlife rescue stories', 'nature documentary clips'],
    };
    const rabbitHoles = rabbitHoleMap[topCat] || rabbitHoleMap.tech;
    const rabbitHole = rabbitHoles[Math.floor(Math.random() * rabbitHoles.length)];

    // Like ratio: second half vs first half (did algorithm hook them?)
    const halfPoint = Math.floor(pastChoices.length / 2);
    const firstHalfLikes = pastChoices.slice(0, halfPoint).filter(c => c.action === 'like').length;
    const secondHalfLikes = pastChoices.slice(halfPoint).filter(c => c.action === 'like').length;
    const gotHooked = secondHalfLikes > firstHalfLikes;

    return {
      feedBreakdown,
      blindSpots,
      diversityCount,
      figuredOutAt,
      algorithmAccuracy,
      socialMatch,
      rabbitHole,
      topCat,
      secondCat,
      totalLikes,
      gotHooked,
      firstHalfLikes,
      secondHalfLikes,
    };
  }, [pastChoices]);

  // JOIN
  if (screen === 'join') {
    return (
      <div className="min-h-screen bg-bg-dark cyber-grid flex flex-col items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm text-center">
          <h1 className="text-3xl font-title font-bold mb-2"><span className="text-glow-cyan text-neon-blue">MAKE YOUR OWN</span></h1>
          <h1 className="text-3xl font-title font-bold mb-8"><span className="text-glow-pink text-neon-pink">BUBBLE</span></h1>
          <form onSubmit={handleJoin} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={15}
              className="w-full px-6 py-4 bg-bg-card border-2 border-neon-blue/50 text-white placeholder-text-muted text-xl text-center focus:outline-none focus:border-neon-blue"
              autoFocus
            />
            {error && <p className="text-danger text-sm">{error}</p>}
            <button
              type="submit"
              disabled={!name.trim() || name.length < 2 || isJoining}
              className={`w-full py-4 font-title font-bold text-xl uppercase tracking-wider ${name.trim().length >= 2 ? 'bg-gradient-to-r from-neon-blue to-neon-pink text-white' : 'bg-bg-card text-text-muted cursor-not-allowed'}`}
            >
              {isJoining ? 'JOINING...' : '[ JOIN ]'}
            </button>
          </form>
          <p className="mt-8 text-text-muted font-title text-sm">Session: {sessionId}</p>
          <p className="text-text-muted text-sm">{participantCount} waiting</p>
        </motion.div>
      </div>
    );
  }

  // WAITING
  if (screen === 'waiting') {
    return (
      <div className="min-h-screen bg-bg-dark cyber-grid flex flex-col items-center justify-center p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-20 h-20 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-8" />
          <h2 className="text-2xl font-title font-bold text-neon-green text-glow-green mb-2">YOU&apos;RE IN, {name.toUpperCase()}!</h2>
          <p className="text-text-muted text-lg mb-8">Waiting for game to start...</p>
          <p className="text-neon-pink text-4xl font-code font-bold mb-2">{participantCount}</p>
          <p className="text-text-muted">players ready</p>
        </motion.div>
      </div>
    );
  }

  // PLAYING
  if (screen === 'playing' && currentCard) {
    const progress = ((cardCount + 1) / TOTAL_CARDS) * 100;

    const activeStreak = Math.abs(streak);
    const streakIsLike = streak > 0;

    return (
      <div className="h-screen bg-bg-dark flex flex-col overflow-hidden relative">
        {/* Screen glow effect for big moments */}
        <AnimatePresence>
          {screenGlow && (
            <motion.div
              className="absolute inset-0 z-40 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, ${screenGlow}20 0%, transparent 70%)` }} />
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: screenGlow, boxShadow: `0 0 30px ${screenGlow}` }} />
              <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: screenGlow, boxShadow: `0 0 30px ${screenGlow}` }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating emoji reactions */}
        <AnimatePresence>
          {floatingEmojis.map((e) => (
            <motion.div
              key={e.id}
              className="absolute z-50 pointer-events-none text-3xl"
              style={{ left: `${e.x}%`, bottom: '20%' }}
              initial={{ opacity: 1, y: 0, scale: 0.5 }}
              animate={{ opacity: 0, y: -200, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              {e.emoji}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Dopamine toast banner */}
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              className="absolute top-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: toast.big ? 1.1 : 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              <div
                className={`px-6 py-3 rounded-sm font-title font-bold text-center whitespace-nowrap ${toast.big ? 'text-xl' : 'text-lg'}`}
                style={{
                  color: toast.color,
                  backgroundColor: `${toast.color}18`,
                  border: `2px solid ${toast.color}60`,
                  boxShadow: `0 0 ${toast.big ? '40' : '20'}px ${toast.color}40`,
                }}
              >
                {toast.message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-2 bg-bg-card flex-shrink-0">
          <motion.div className="h-full bg-gradient-to-r from-neon-blue to-neon-pink" animate={{ width: `${progress}%` }} />
        </div>
        <div className="p-3 text-center flex items-center justify-center gap-3 flex-shrink-0">
          <span className="text-text-muted font-code text-sm">{cardCount + 1} / {TOTAL_CARDS}</span>
          {/* Streak counter */}
          <AnimatePresence>
            {activeStreak >= 3 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="font-code font-bold text-sm"
                style={{ color: streakIsLike ? '#39FF14' : '#00F0FF' }}
              >
                {streakIsLike ? '🔥' : '❄️'} {activeStreak}x
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 min-h-0">
          <SwipeableCard key={currentCard.id} content={currentCard} onSwipe={handleChoice} />
        </div>
        <div className="p-4 pb-6 flex gap-4 flex-shrink-0">
          <button onClick={() => handleChoice('skip')} className="flex-1 py-5 bg-danger/20 border-2 border-danger text-danger font-title font-bold text-xl uppercase active:bg-danger active:text-black rounded-sm">SKIP</button>
          <button onClick={() => handleChoice('like')} className="flex-1 py-5 bg-neon-green/20 border-2 border-neon-green text-neon-green font-title font-bold text-xl uppercase active:bg-neon-green active:text-black rounded-sm">LIKE</button>
        </div>
      </div>
    );
  }

  // COMPLETE — personalized insights
  return (
    <div className="min-h-screen bg-bg-dark cyber-grid overflow-y-auto">
      <div className="max-w-sm mx-auto px-5 py-8 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-16 h-16 bg-neon-green rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ boxShadow: '0 0 30px #39FF14' }}
          >
            <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-title font-bold text-white mb-1">ALL DONE!</h2>
          <p className="text-text-muted">You rated <span className="text-neon-blue font-code font-bold">{choices.length}</span> headlines</p>
        </motion.div>

        {/* ── PREDICTABILITY ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-bg-card/80 border border-neon-pink/30 p-5"
        >
          <h3 className="text-neon-pink text-xs font-title uppercase tracking-[0.2em] mb-3">THE ALGORITHM FIGURED YOU OUT</h3>
          <p className="text-5xl font-code font-bold text-white mb-1">
            {insights.figuredOutAt < pastChoices.length ? (
              <>{insights.figuredOutAt} <span className="text-xl text-text-muted">swipes</span></>
            ) : (
              <span className="text-2xl">COULDN&apos;T CRACK YOU</span>
            )}
          </p>
          {insights.figuredOutAt < pastChoices.length ? (
            <p className="text-text-muted text-sm">
              After that, it predicted your choices with{' '}
              <span className="text-neon-pink font-bold">{insights.algorithmAccuracy}%</span> accuracy
            </p>
          ) : (
            <p className="text-neon-green text-sm font-bold">You resisted the algorithm!</p>
          )}
        </motion.div>

        {/* ── FEED BREAKDOWN ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-bg-card/80 border border-neon-blue/30 p-5"
        >
          <h3 className="text-neon-blue text-xs font-title uppercase tracking-[0.2em] mb-3">YOUR BUBBLE</h3>
          {insights.feedBreakdown.length > 0 ? (
            <div className="space-y-2">
              {insights.feedBreakdown.map((item, idx) => {
                const color = getCategoryColor(item.category);
                const info = categoryInfo[item.category];
                return (
                  <motion.div
                    key={item.category}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + idx * 0.08 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-lg">{info?.emoji}</span>
                    <span className="text-white text-sm font-medium w-24 truncate">{info?.name || item.category}</span>
                    <div className="flex-1 h-5 bg-bg-dark/50 relative overflow-hidden">
                      <motion.div
                        className="h-full"
                        style={{ backgroundColor: color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percent}%` }}
                        transition={{ delay: 0.9 + idx * 0.08, duration: 0.5 }}
                      />
                    </div>
                    <span className="text-text-muted text-xs font-code w-10 text-right">{item.percent}%</span>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <p className="text-text-muted text-sm">You skipped everything!</p>
          )}
        </motion.div>

        {/* ── BLIND SPOTS ── */}
        {insights.blindSpots.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-bg-card/80 border border-danger/30 p-5"
          >
            <h3 className="text-danger text-xs font-title uppercase tracking-[0.2em] mb-3">YOUR BLIND SPOTS</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {insights.blindSpots.map(cat => {
                const info = categoryInfo[cat];
                return (
                  <span key={cat} className="px-3 py-1 bg-danger/10 border border-danger/30 text-white text-sm">
                    {info?.emoji} {info?.name || cat}
                  </span>
                );
              })}
            </div>
            <p className="text-text-muted text-xs">
              In a real feed, you&apos;d never know these topics exist.
              {insights.blindSpots.length >= 4 && ' That\'s half the world hidden from you.'}
            </p>
          </motion.div>
        )}

        {/* ── HOOK CHECK ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-bg-card/80 border border-warning/30 p-5"
        >
          <h3 className="text-warning text-xs font-title uppercase tracking-[0.2em] mb-3">
            {insights.gotHooked ? 'THE ALGORITHM HOOKED YOU' : 'YOU FOUGHT BACK'}
          </h3>
          <div className="flex items-center gap-4 mb-2">
            <div className="text-center flex-1">
              <p className="text-2xl font-code font-bold text-text-muted">{insights.firstHalfLikes}</p>
              <p className="text-xs text-text-muted">likes (first half)</p>
            </div>
            <span className="text-xl">{insights.gotHooked ? '→' : '←'}</span>
            <div className="text-center flex-1">
              <p className={`text-2xl font-code font-bold ${insights.gotHooked ? 'text-warning' : 'text-neon-green'}`}>{insights.secondHalfLikes}</p>
              <p className="text-xs text-text-muted">likes (second half)</p>
            </div>
          </div>
          <p className="text-text-muted text-xs">
            {insights.gotHooked
              ? 'You liked more as your feed narrowed — the algorithm won.'
              : 'You got more selective as the bubble formed — nice awareness.'}
          </p>
        </motion.div>

        {/* ── SOCIAL MEDIA MATCH ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="bg-bg-card/80 border border-neon-purple/30 p-5"
          style={{ borderColor: '#BF00FF50' }}
        >
          <h3 className="text-xs font-title uppercase tracking-[0.2em] mb-3" style={{ color: '#BF00FF' }}>THE ALGORITHM THINKS YOU LIVE ON</h3>
          <p className="text-2xl font-title font-bold text-white mb-1">{insights.socialMatch.platform}</p>
          <p className="text-text-muted text-sm">{insights.socialMatch.reason}</p>
        </motion.div>

        {/* ── RABBIT HOLE ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="bg-bg-card/80 border border-neon-yellow/30 p-5"
          style={{ borderColor: '#FFE50050' }}
        >
          <h3 className="text-xs font-title uppercase tracking-[0.2em] mb-3" style={{ color: '#FFE500' }}>YOUR YOUTUBE RABBIT HOLE</h3>
          <p className="text-white text-lg font-medium">{insights.rabbitHole}</p>
          <p className="text-text-muted text-xs mt-1">...at 2am, obviously</p>
        </motion.div>

        {/* ── DIVERSITY SCORE ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="bg-bg-card/80 border border-neon-green/30 p-5 text-center"
        >
          <h3 className="text-neon-green text-xs font-title uppercase tracking-[0.2em] mb-2">ALGORITHM RESISTANCE</h3>
          <p className="text-4xl font-code font-bold text-white mb-1">
            {insights.diversityCount}<span className="text-lg text-text-muted">/8</span>
          </p>
          <p className="text-text-muted text-xs">
            {insights.diversityCount <= 2 ? 'Easy to profile — you have a type.'
              : insights.diversityCount <= 4 ? 'Moderate diversity — the algorithm still boxed you.'
              : insights.diversityCount <= 6 ? 'Hard to pin down — you kept the algorithm guessing.'
              : 'Maximum resistance — the algorithm couldn\'t build your bubble!'}
          </p>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center text-text-muted text-sm pt-2 pb-4"
        >
          Look at the screen to see everyone&apos;s bubbles!
        </motion.p>
      </div>
    </div>
  );
}

function SwipeableCard({ content, onSwipe }: { content: ContentItem; onSwipe: (action: 'like' | 'skip') => void }) {
  const [dragX, setDragX] = useState(0);
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) onSwipe('like');
    else if (info.offset.x < -100) onSwipe('skip');
    setDragX(0);
  };
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDrag={(e, info) => setDragX(info.offset.x)}
      onDragEnd={handleDragEnd}
      animate={{ rotate: dragX * 0.1 }}
      className="w-full max-w-sm cursor-grab active:cursor-grabbing"
    >
      <div className="relative p-8 min-h-[250px] flex flex-col justify-center bg-bg-card border border-white/10">
        <div className="absolute top-4 right-4 px-4 py-2 border-2 border-neon-green text-neon-green font-title font-bold rotate-12 text-xl" style={{ opacity: Math.max(0, dragX / 150) }}>LIKE</div>
        <div className="absolute top-4 left-4 px-4 py-2 border-2 border-danger text-danger font-title font-bold -rotate-12 text-xl" style={{ opacity: Math.max(0, -dragX / 150) }}>SKIP</div>
        <p className="text-2xl md:text-3xl text-white font-medium leading-relaxed">{content.headline}</p>
      </div>
    </motion.div>
  );
}
