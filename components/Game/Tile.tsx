'use client';

import { TileState } from '@/lib/constants';

interface TileProps {
  letter: string;
  state: TileState;
  position: number;
  isRevealing?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Colors for the back face (revealed state)
const backStateClasses: Record<TileState, string> = {
  empty: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
  tbd: 'bg-white dark:bg-gray-800 border-gray-500 dark:border-gray-400 text-black dark:text-white',
  correct: 'bg-green-500 border-green-500 text-white',
  present: 'bg-amber-500 border-amber-500 text-white',
  absent: 'bg-gray-600 border-gray-600 text-white',
};

// Front face is always neutral
const frontStateClasses: Record<TileState, string> = {
  empty: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
  tbd: 'bg-white dark:bg-gray-800 border-gray-500 dark:border-gray-400 text-black dark:text-white',
  correct: 'bg-white dark:bg-gray-800 border-gray-500 dark:border-gray-400 text-black dark:text-white',
  present: 'bg-white dark:bg-gray-800 border-gray-500 dark:border-gray-400 text-black dark:text-white',
  absent: 'bg-white dark:bg-gray-800 border-gray-500 dark:border-gray-400 text-black dark:text-white',
};

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'w-10 h-10 sm:w-12 sm:h-12 text-lg sm:text-xl',
  md: 'w-12 h-12 sm:w-14 sm:h-14 text-xl sm:text-2xl',
  lg: 'w-14 h-14 sm:w-16 sm:h-16 text-2xl sm:text-3xl',
};

export default function Tile({ letter, state, position, isRevealing = false, size = 'lg' }: TileProps) {
  const delay = position * 300;
  const isRevealed = state === 'correct' || state === 'present' || state === 'absent';
  const shouldFlip = isRevealing && isRevealed;

  // If not revealing and already revealed (from saved state), show colored tile directly
  if (isRevealed && !isRevealing) {
    return (
      <div
        className={`
          ${sizeClasses[size]}
          flex items-center justify-center
          font-bold uppercase
          border-2 rounded
          ${backStateClasses[state]}
        `}
      >
        {letter}
      </div>
    );
  }

  // For tiles that need to flip or are in tbd/empty state
  return (
    <div
      className={`${sizeClasses[size]} perspective-500`}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`
          relative w-full h-full
          transition-transform duration-500
          ${shouldFlip ? 'animate-flip-card' : ''}
        `}
        style={{
          transformStyle: 'preserve-3d',
          animationDelay: shouldFlip ? `${delay}ms` : '0ms',
        }}
      >
        {/* Front face - no color */}
        <div
          className={`
            absolute inset-0
            flex items-center justify-center
            font-bold uppercase
            border-2 rounded
            backface-hidden
            ${frontStateClasses[state]}
            ${letter && (state === 'tbd' || shouldFlip) ? 'scale-105' : ''}
          `}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {letter}
        </div>

        {/* Back face - colored */}
        <div
          className={`
            absolute inset-0
            flex items-center justify-center
            font-bold uppercase
            border-2 rounded
            backface-hidden
            ${backStateClasses[state]}
          `}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateX(180deg)',
          }}
        >
          {letter}
        </div>
      </div>
    </div>
  );
}
