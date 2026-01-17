'use client';

import { MAX_GUESSES, TileState } from '@/lib/constants';
import Tile from './Tile';

interface BoardProps {
  guesses: string[];
  evaluations: TileState[][];
  currentGuess: string;
  wordLength: number;
  isRevealing: boolean;
  revealingRow: number;
}

export default function Board({
  guesses,
  evaluations,
  currentGuess,
  wordLength,
  isRevealing,
  revealingRow,
}: BoardProps) {
  // Determine tile size based on word length for mobile fit
  const tileSize: 'sm' | 'md' | 'lg' = wordLength >= 7 ? 'sm' : wordLength >= 6 ? 'md' : 'lg';

  const rows = [];

  for (let i = 0; i < MAX_GUESSES; i++) {
    const guess = guesses[i];
    const evaluation = evaluations[i];
    const isCurrentRow = i === guesses.length;
    const isRevealingThisRow = isRevealing && i === revealingRow;

    const tiles = [];
    for (let j = 0; j < wordLength; j++) {
      let letter = '';
      let state: TileState = 'empty';

      if (guess) {
        // Completed row
        letter = guess[j] || '';
        state = evaluation?.[j] || 'absent';
      } else if (isCurrentRow) {
        // Current row being typed
        letter = currentGuess[j] || '';
        state = letter ? 'tbd' : 'empty';
      }

      tiles.push(
        <Tile
          key={`${i}-${j}`}
          letter={letter}
          state={state}
          position={j}
          isRevealing={isRevealingThisRow}
          size={tileSize}
        />
      );
    }

    rows.push(
      <div key={i} className="flex gap-1 justify-center">
        {tiles}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 py-4">
      {rows}
    </div>
  );
}
