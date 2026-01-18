'use client';

import { KEYBOARD_ROWS_GR, TileState } from '@/lib/constants';

interface KeyboardProps {
  keyStates: Map<string, TileState>;
  onKeyPress: (key: string) => void;
  disabled?: boolean;
}

const stateClasses: Record<TileState | 'unused', string> = {
  // Unplayed letters - bright and prominent
  unused: 'bg-gray-300 dark:bg-gray-500 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-400 shadow-sm',
  empty: 'bg-gray-300 dark:bg-gray-500 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-400 shadow-sm',
  tbd: 'bg-gray-300 dark:bg-gray-500 text-gray-900 dark:text-white',
  // Correct letters - vibrant green
  correct: 'bg-green-500 text-white hover:bg-green-600 shadow-md ring-2 ring-green-400',
  // Present letters (right letter, wrong position) - vibrant yellow/amber
  present: 'bg-amber-500 text-white hover:bg-amber-600 shadow-md ring-2 ring-amber-400',
  // Absent letters (not in word) - dark and muted
  absent: 'bg-gray-700 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-gray-600 dark:hover:bg-gray-700',
};

export default function Keyboard({ keyStates, onKeyPress, disabled = false }: KeyboardProps) {
  const KEYBOARD_ROWS = KEYBOARD_ROWS_GR;

  const handleClick = (key: string) => {
    if (!disabled) {
      onKeyPress(key);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-lg mx-auto px-1">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1">
          {rowIndex === 2 && (
            <button
              onClick={() => handleClick('ENTER')}
              disabled={disabled}
              className={`
                px-2 sm:px-4 py-4 text-xs sm:text-sm font-bold rounded
                ${stateClasses.unused}
                transition-colors duration-150
                disabled:opacity-50
              `}
            >
              ENTER
            </button>
          )}
          {row.map((key) => {
            const state = keyStates.get(key) || 'unused';
            return (
              <button
                key={key}
                onClick={() => handleClick(key)}
                disabled={disabled}
                className={`
                  w-8 sm:w-10 py-4 text-sm sm:text-lg font-bold rounded
                  ${stateClasses[state]}
                  transition-colors duration-150
                  disabled:opacity-50
                `}
              >
                {key}
              </button>
            );
          })}
          {rowIndex === 2 && (
            <button
              onClick={() => handleClick('BACKSPACE')}
              disabled={disabled}
              className={`
                px-2 sm:px-4 py-4 text-xs sm:text-sm font-bold rounded
                ${stateClasses.unused}
                transition-colors duration-150
                disabled:opacity-50
              `}
            >
              ⌫
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
