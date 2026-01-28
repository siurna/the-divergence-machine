'use client';

import { useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ContentItem, Choice } from '@/types';

interface CardSwiperProps {
  content: ContentItem[];
  onChoice: (contentId: string, action: 'like' | 'skip') => void;
  onComplete: () => void;
}

export function CardSwiper({ content, onChoice, onComplete }: CardSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  // Indicator colors based on swipe direction
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const skipOpacity = useTransform(x, [-100, 0], [1, 0]);

  const currentCard = content[currentIndex];
  const progress = currentIndex;
  const total = content.length;

  const handleChoice = useCallback(
    (action: 'like' | 'skip') => {
      if (isAnimating || currentIndex >= content.length) return;

      setIsAnimating(true);
      onChoice(currentCard.id, action);

      // Animate card exit
      setTimeout(() => {
        if (currentIndex + 1 >= content.length) {
          onComplete();
        } else {
          setCurrentIndex((i) => i + 1);
        }
        setIsAnimating(false);
        x.set(0);
      }, 200);
    },
    [currentIndex, content.length, currentCard, onChoice, onComplete, isAnimating, x]
  );

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const threshold = 100;

      if (info.offset.x > threshold) {
        handleChoice('like');
      } else if (info.offset.x < -threshold) {
        handleChoice('skip');
      }
    },
    [handleChoice]
  );

  if (currentIndex >= content.length) {
    return null; // Will be handled by parent showing CompleteScreen
  }

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col p-4">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-text-muted mb-2">
          <span>Progress</span>
          <span>
            {progress}/{total}
          </span>
        </div>
        <div className="h-2 bg-bg-card rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(progress / total) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Card Area */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Swipe Indicators */}
        <motion.div
          className="absolute left-4 top-1/2 -translate-y-1/2 text-danger text-4xl font-bold"
          style={{ opacity: skipOpacity }}
        >
          SKIP
        </motion.div>
        <motion.div
          className="absolute right-4 top-1/2 -translate-y-1/2 text-success text-4xl font-bold"
          style={{ opacity: likeOpacity }}
        >
          LIKE
        </motion.div>

        {/* Card */}
        <motion.div
          className="w-full max-w-sm bg-bg-card rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          style={{ x, rotate, opacity }}
          onDragEnd={handleDragEnd}
          whileTap={{ cursor: 'grabbing' }}
        >
          {/* Card Image Placeholder */}
          <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
            <span className="text-6xl opacity-30">
              {getCategoryIcon(currentCard.category)}
            </span>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <p className="text-lg text-text-primary leading-relaxed">
              &ldquo;{currentCard.headline}&rdquo;
            </p>
            <div className="mt-4 flex gap-2 flex-wrap">
              {currentCard.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-slate-700 rounded text-xs text-text-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 py-6">
        <motion.button
          onClick={() => handleChoice('skip')}
          disabled={isAnimating}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-20 h-20 bg-danger/20 border-2 border-danger rounded-full
                   flex items-center justify-center text-danger text-3xl
                   hover:bg-danger/30 transition-colors disabled:opacity-50"
        >
          <span role="img" aria-label="skip">
            👎
          </span>
        </motion.button>

        <motion.button
          onClick={() => handleChoice('like')}
          disabled={isAnimating}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-20 h-20 bg-success/20 border-2 border-success rounded-full
                   flex items-center justify-center text-success text-3xl
                   hover:bg-success/30 transition-colors disabled:opacity-50"
        >
          <span role="img" aria-label="like">
            👍
          </span>
        </motion.button>
      </div>

      {/* Swipe Hint */}
      <p className="text-center text-text-muted text-sm pb-4">
        Swipe left to skip, right to like
      </p>
    </div>
  );
}

function getCategoryIcon(category: string): string {
  const prefix = category.split('_')[0];
  const icons: Record<string, string> = {
    politics: '📰',
    tech: '💻',
    entertainment: '🎬',
    science: '🔬',
    sports: '⚽',
    lifestyle: '✨',
    finance: '💰',
    animals: '🐾',
  };
  return icons[prefix] || '📌';
}
