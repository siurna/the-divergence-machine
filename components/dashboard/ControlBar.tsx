'use client';

import { motion } from 'framer-motion';
import { GameState } from '@/types';

interface ControlBarProps {
  gameState: GameState;
  timeRemaining: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReveal: () => void;
  onReset: () => void;
}

export function ControlBar({
  gameState,
  timeRemaining,
  onStart,
  onPause,
  onResume,
  onReveal,
  onReset,
}: ControlBarProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStateLabel = (): string => {
    switch (gameState) {
      case 'waiting':
        return 'WAITING';
      case 'playing':
        return 'PLAYING';
      case 'paused':
        return 'PAUSED';
      case 'reveal':
        return 'REVEAL';
      case 'ended':
        return 'ENDED';
    }
  };

  const getStateColor = (): string => {
    switch (gameState) {
      case 'playing':
        return 'text-success';
      case 'paused':
        return 'text-warning';
      case 'reveal':
        return 'text-primary';
      default:
        return 'text-text-muted';
    }
  };

  return (
    <div className="bg-bg-card rounded-xl p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-text-muted text-sm">Status:</span>
            <span className={`font-bold ${getStateColor()}`}>
              {getStateLabel()}
            </span>
          </div>

          {(gameState === 'playing' || gameState === 'paused') && (
            <div className="flex items-center gap-2">
              <span className="text-text-muted text-sm">Time:</span>
              <motion.span
                key={timeRemaining}
                className="font-mono text-xl text-text-primary font-bold"
              >
                {formatTime(timeRemaining)}
              </motion.span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {gameState === 'waiting' && (
            <ControlButton onClick={onStart} variant="primary">
              START
            </ControlButton>
          )}

          {gameState === 'playing' && (
            <>
              <ControlButton onClick={onPause} variant="warning">
                PAUSE
              </ControlButton>
              <ControlButton onClick={onReveal} variant="primary">
                REVEAL
              </ControlButton>
            </>
          )}

          {gameState === 'paused' && (
            <>
              <ControlButton onClick={onResume} variant="success">
                RESUME
              </ControlButton>
              <ControlButton onClick={onReveal} variant="primary">
                REVEAL
              </ControlButton>
            </>
          )}

          {(gameState === 'reveal' || gameState === 'ended') && (
            <ControlButton onClick={onReset} variant="secondary">
              RESET
            </ControlButton>
          )}
        </div>

        {/* Keyboard Hints */}
        <div className="text-xs text-text-muted">
          {gameState === 'waiting' && 'Press SPACE to start'}
          {gameState === 'playing' && 'SPACE: pause | R: reveal'}
          {gameState === 'paused' && 'SPACE: resume | R: reveal'}
          {gameState === 'reveal' && 'ESC: reset'}
        </div>
      </div>
    </div>
  );
}

interface ControlButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

function ControlButton({ children, onClick, variant }: ControlButtonProps) {
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-white',
    secondary: 'bg-slate-600 hover:bg-slate-500 text-white',
    success: 'bg-success hover:bg-green-600 text-white',
    warning: 'bg-warning hover:bg-yellow-600 text-white',
    danger: 'bg-danger hover:bg-red-600 text-white',
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`px-6 py-2 rounded-lg font-semibold transition-colors ${variantClasses[variant]}`}
    >
      {children}
    </motion.button>
  );
}
