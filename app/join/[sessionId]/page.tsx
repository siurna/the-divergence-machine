'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { JoinScreen } from '@/components/phone/JoinScreen';
import { WaitingScreen } from '@/components/phone/WaitingScreen';
import { CardSwiper } from '@/components/phone/CardSwiper';
import { CompleteScreen } from '@/components/phone/CompleteScreen';
import {
  subscribeToGameState,
  subscribeToParticipantCount,
  addParticipant,
  recordChoice,
  sessionExists,
} from '@/lib/firebase';
import { generateContentQueue } from '@/lib/content';
import { getTopCategories } from '@/lib/similarity';
import { GameState, ContentItem, Choice, Participant } from '@/types';

type Screen = 'join' | 'waiting' | 'playing' | 'complete' | 'error';

export default function JoinPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [screen, setScreen] = useState<Screen>('join');
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [participantCount, setParticipantCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Participant state
  const [odId, setOdId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [contentQueue, setContentQueue] = useState<ContentItem[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);

  // Check if session exists on mount
  useEffect(() => {
    const checkSession = async () => {
      const exists = await sessionExists(sessionId);
      if (!exists) {
        setErrorMessage('Session not found. Please check the code and try again.');
        setScreen('error');
      }
    };
    checkSession();
  }, [sessionId]);

  // Subscribe to game state and participant count
  useEffect(() => {
    if (screen === 'error') return;

    const unsubGameState = subscribeToGameState(sessionId, (state) => {
      setGameState(state);

      // Transition screens based on game state
      if (state === 'playing' && screen === 'waiting') {
        setScreen('playing');
      }
    });

    const unsubCount = subscribeToParticipantCount(sessionId, setParticipantCount);

    return () => {
      unsubGameState();
      unsubCount();
    };
  }, [sessionId, screen]);

  // Handle joining
  const handleJoin = useCallback(
    async (playerName: string) => {
      setIsLoading(true);
      try {
        const participantId = await addParticipant(sessionId, playerName);
        setOdId(participantId);
        setName(playerName);

        // Generate content queue
        const queue = generateContentQueue(40);
        setContentQueue(queue);

        // If game is already playing, go directly to playing
        if (gameState === 'playing') {
          setScreen('playing');
        } else {
          setScreen('waiting');
        }
      } catch (error) {
        console.error('Failed to join:', error);
        setErrorMessage('Failed to join session. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, gameState]
  );

  // Handle choice
  const handleChoice = useCallback(
    async (contentId: string, action: 'like' | 'skip') => {
      const choice: Choice = {
        contentId,
        action,
        timestamp: Date.now(),
      };

      setChoices((prev) => [...prev, choice]);

      // Record to Firebase
      try {
        await recordChoice(sessionId, odId, choice);
      } catch (error) {
        console.error('Failed to record choice:', error);
      }
    },
    [sessionId, odId]
  );

  // Handle completion
  const handleComplete = useCallback(() => {
    setScreen('complete');
  }, []);

  // Get top categories for complete screen
  const getTopCats = (): string[] => {
    const mockParticipant: Participant = {
      odId,
      name,
      joinedAt: Date.now(),
      choices,
      currentCardIndex: choices.length,
      position: { x: 50, y: 50 },
      isActive: true,
    };
    return getTopCategories(mockParticipant);
  };

  // Error screen
  if (screen === 'error') {
    return (
      <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-danger mb-4">Oops!</h2>
          <p className="text-text-muted mb-6">{errorMessage}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
          >
            Go Back
          </a>
        </div>
      </div>
    );
  }

  // Render current screen
  switch (screen) {
    case 'join':
      return (
        <JoinScreen
          sessionId={sessionId}
          participantCount={participantCount}
          onJoin={handleJoin}
          isLoading={isLoading}
        />
      );

    case 'waiting':
      return (
        <WaitingScreen name={name} participantCount={participantCount} />
      );

    case 'playing':
      return (
        <CardSwiper
          content={contentQueue}
          onChoice={handleChoice}
          onComplete={handleComplete}
        />
      );

    case 'complete':
      return (
        <CompleteScreen totalRated={choices.length} topCategories={getTopCats()} />
      );

    default:
      return null;
  }
}
