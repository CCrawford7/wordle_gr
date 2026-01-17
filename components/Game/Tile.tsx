'use client';

import { TileState } from '@/lib/constants';

interface TileProps {
  letter: string;
  state: TileState;
  position: number;
  isRevealing?: boolean;
}

const stateClasses: Record<TileState, string> = {
  empty: 'border-gray-300 dark:border-gray-600',
  tbd: 'border-gray-500 dark:border-gray-400 text-black dark:text-white',
  correct: 'bg-green-500 border-green-500 text-white',
  present: 'bg-yellow-500 border-yellow-500 text-white',
  absent: 'bg-gray-500 border-gray-500 text-white',
};

export default function Tile({ letter, state, position, isRevealing = false }: TileProps) {
  const delay = position * 300; // Stagger animation by position

  return (
    <div
      className={`
        w-14 h-14 sm:w-16 sm:h-16
        flex items-center justify-center
        text-2xl sm:text-3xl font-bold uppercase
        border-2 rounded
        transition-all duration-300
        ${stateClasses[state]}
        ${letter && state === 'tbd' ? 'scale-105' : ''}
        ${isRevealing ? 'animate-flip' : ''}
      `}
      style={{
        animationDelay: isRevealing ? `${delay}ms` : '0ms',
      }}
    >
      {letter}
    </div>
  );
}
