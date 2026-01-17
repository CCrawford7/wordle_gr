'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import { GameMode, GameStatus, TileState } from '@/lib/constants';
import { generateShareText } from '@/lib/game-logic';
import { getGameNumber, getTimeUntilNextWord } from '@/lib/daily';
import { getStats } from '@/lib/storage';

interface GameEndProps {
  isOpen: boolean;
  onClose: () => void;
  status: GameStatus;
  mode: GameMode;
  wordLength: number;
  solution: string;
  guesses: string[];
  evaluations: TileState[][];
  onPlayAgain?: () => void;
}

function Countdown() {
  const [time, setTime] = useState(getTimeUntilNextWord());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeUntilNextWord());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="text-center">
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
        Επόμενη Λεξούλι
      </div>
      <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
        {pad(time.hours)}:{pad(time.minutes)}:{pad(time.seconds)}
      </div>
    </div>
  );
}

export default function GameEnd({
  isOpen,
  onClose,
  status,
  mode,
  wordLength,
  solution,
  guesses,
  evaluations,
  onPlayAgain,
}: GameEndProps) {
  const [copied, setCopied] = useState(false);
  const stats = typeof window !== 'undefined' ? getStats(mode, wordLength) : null;

  const gameNumber = getGameNumber(wordLength);
  const won = status === 'won';

  const handleShare = async () => {
    const shareText = generateShareText(evaluations, wordLength, gameNumber, won);

    try {
      if (navigator.share) {
        await navigator.share({ text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // User cancelled or error
    }
  };

  if (status === 'playing') return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={won ? 'Μπράβο! 🎉' : 'Κρίμα...'}
    >
      <div className="space-y-6">
        {/* Result message */}
        <div className="text-center">
          {won ? (
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Βρήκες τη λέξη σε <strong>{guesses.length}</strong> {guesses.length === 1 ? 'προσπάθεια' : 'προσπάθειες'}!
            </p>
          ) : (
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Η λέξη ήταν:
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {solution}
              </p>
            </div>
          )}
        </div>

        {/* Quick stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 text-center py-4 border-y border-gray-200 dark:border-gray-700">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.played}
              </div>
              <div className="text-xs text-gray-500">Παιχνίδια</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0}%
              </div>
              <div className="text-xs text-gray-500">Νίκες</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.currentStreak}
              </div>
              <div className="text-xs text-gray-500">Σερί</div>
            </div>
          </div>
        )}

        {/* Countdown for daily mode */}
        {mode === 'daily' && <Countdown />}

        {/* Action buttons */}
        <div className="flex gap-3">
          {mode === 'practice' && onPlayAgain && (
            <button
              onClick={onPlayAgain}
              className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Παίξε Ξανά
            </button>
          )}
          <button
            onClick={handleShare}
            className="flex-1 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            {copied ? (
              'Αντιγράφηκε!'
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Κοινοποίηση
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
