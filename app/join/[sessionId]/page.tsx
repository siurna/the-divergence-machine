'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion, PanInfo } from 'framer-motion';
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
        await recordChoice(sessionId, odId, choice);
      } catch (error) {
        console.error('Failed to record:', error);
      }

      const newCardCount = cardCount + 1;
      setCardCount(newCardCount);

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
    [sessionId, odId, currentCard, pastChoices, cardCount]
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

  // JOIN
  if (screen === 'join') {
    return (
      <div className="min-h-screen bg-bg-dark cyber-grid flex flex-col items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm text-center">
          <h1 className="text-3xl font-black mb-2"><span className="text-glow-cyan text-neon-blue">MAKE YOUR OWN</span></h1>
          <h1 className="text-3xl font-black mb-8"><span className="text-glow-pink text-neon-pink">BUBBLE</span></h1>
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
              className={`w-full py-4 font-bold text-xl uppercase tracking-wider ${name.trim().length >= 2 ? 'bg-gradient-to-r from-neon-blue to-neon-pink text-white' : 'bg-bg-card text-text-muted cursor-not-allowed'}`}
            >
              {isJoining ? 'JOINING...' : '[ JOIN ]'}
            </button>
          </form>
          <p className="mt-8 text-text-muted font-mono text-sm">Session: {sessionId}</p>
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
          <h2 className="text-2xl font-bold text-neon-green text-glow-green mb-2">YOU'RE IN, {name.toUpperCase()}!</h2>
          <p className="text-text-muted text-lg mb-8">Waiting for game to start...</p>
          <p className="text-neon-pink text-4xl font-bold mb-2">{participantCount}</p>
          <p className="text-text-muted">players ready</p>
        </motion.div>
      </div>
    );
  }

  // PLAYING
  if (screen === 'playing' && currentCard) {
    const progress = ((cardCount + 1) / TOTAL_CARDS) * 100;
    const categoryColor = getCategoryColor(getCategoryGroup(currentCard.category));

    return (
      <div className="min-h-screen bg-bg-dark flex flex-col">
        <div className="h-2 bg-bg-card">
          <motion.div className="h-full bg-gradient-to-r from-neon-blue to-neon-pink" animate={{ width: `${progress}%` }} />
        </div>
        <div className="p-4 text-center text-text-muted font-mono text-sm">{cardCount + 1} / {TOTAL_CARDS}</div>
        <div className="flex-1 flex items-center justify-center p-4">
          <SwipeableCard key={currentCard.id} content={currentCard} categoryColor={categoryColor} onSwipe={handleChoice} />
        </div>
        <div className="p-6 flex gap-4">
          <button onClick={() => handleChoice('skip')} className="flex-1 py-4 bg-danger/20 border-2 border-danger text-danger font-bold text-xl uppercase active:bg-danger active:text-black">SKIP</button>
          <button onClick={() => handleChoice('like')} className="flex-1 py-4 bg-neon-green/20 border-2 border-neon-green text-neon-green font-bold text-xl uppercase active:bg-neon-green active:text-black">LIKE</button>
        </div>
      </div>
    );
  }

  // COMPLETE
  return (
    <div className="min-h-screen bg-bg-dark cyber-grid flex flex-col items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 bg-neon-green rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ boxShadow: '0 0 30px #39FF14' }}
        >
          <svg className="w-10 h-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h2 className="text-3xl font-black text-white mb-4">ALL DONE!</h2>
        <p className="text-xl text-text-muted mb-8">You rated <span className="text-neon-blue font-bold">{choices.length}</span> headlines</p>
        <div className="bg-bg-card/50 border border-neon-pink/30 p-6 mb-8">
          <h3 className="text-neon-pink text-sm font-mono uppercase tracking-wider mb-4">YOUR BUBBLE</h3>
          {topCategories.length > 0 ? (
            <div className="space-y-3">
              {topCategories.map((cat, index) => {
                const info = categoryInfo[cat];
                const color = getCategoryColor(cat);
                return (
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-3 p-3"
                    style={{ backgroundColor: `${color}20`, borderLeft: `3px solid ${color}` }}
                  >
                    <span className="text-2xl">{info?.emoji}</span>
                    <span className="text-white font-medium">{info?.name || cat}</span>
                    {index === 0 && <span className="ml-auto text-xs font-mono" style={{ color }}>TOP</span>}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <p className="text-text-muted">No clear preferences</p>
          )}
        </div>
        <p className="text-text-muted">Look at the screen to see everyone's bubbles!</p>
      </motion.div>
    </div>
  );
}

function SwipeableCard({ content, categoryColor, onSwipe }: { content: ContentItem; categoryColor: string; onSwipe: (action: 'like' | 'skip') => void }) {
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
      <div className="relative p-6 min-h-[300px] flex flex-col justify-center" style={{ backgroundColor: '#12121A', borderLeft: `4px solid ${categoryColor}`, boxShadow: `0 0 30px ${categoryColor}30` }}>
        <div className="absolute top-4 right-4 px-4 py-2 border-2 border-neon-green text-neon-green font-bold rotate-12 text-xl" style={{ opacity: Math.max(0, dragX / 150) }}>LIKE</div>
        <div className="absolute top-4 left-4 px-4 py-2 border-2 border-danger text-danger font-bold -rotate-12 text-xl" style={{ opacity: Math.max(0, -dragX / 150) }}>SKIP</div>
        <p className="text-xl md:text-2xl text-white font-medium leading-relaxed">"{content.headline}"</p>
      </div>
    </motion.div>
  );
}
