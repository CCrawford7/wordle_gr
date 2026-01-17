'use client';

import { KEYBOARD_ROWS, TileState } from '@/lib/constants';

interface KeyboardProps {
  keyStates: Map<string, TileState>;
  onKeyPress: (key: string) => void;
  disabled?: boolean;
}

const stateClasses: Record<TileState | 'unused', string> = {
  unused: 'bg-gray-200 dark:bg-gray-600 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500',
  empty: 'bg-gray-200 dark:bg-gray-600 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500',
  tbd: 'bg-gray-200 dark:bg-gray-600 text-black dark:text-white',
  correct: 'bg-green-500 text-white hover:bg-green-600',
  present: 'bg-yellow-500 text-white hover:bg-yellow-600',
  absent: 'bg-gray-500 text-white hover:bg-gray-600',
};

export default function Keyboard({ keyStates, onKeyPress, disabled = false }: KeyboardProps) {
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
