'use client';

import { useState, useEffect } from 'react';
import { GameMode, DEFAULT_WORD_LENGTH, MIN_WORD_LENGTH, MAX_WORD_LENGTH } from '@/lib/constants';
import { useGame } from '@/hooks/useGame';
import Board from './Board';
import Keyboard from './Keyboard';
import Header from '../Header';
import HowToPlay from '../Modal/HowToPlay';
import Stats from '../Modal/Stats';
import Settings from '../Modal/Settings';
import GameEnd from '../Modal/GameEnd';
import HintModal from '../Hints/HintModal';
import BannerAd from '../Ads/BannerAd';
import DebugPanel from '../Debug/DebugPanel';
import Leaderboard from '../Modal/Leaderboard';

export default function GameContainer() {
  const [mode, setMode] = useState<GameMode>('daily');
  const [wordLength, setWordLength] = useState<number>(DEFAULT_WORD_LENGTH);

  // Modal states
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGameEnd, setShowGameEnd] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [pendingScore, setPendingScore] = useState<{ attempts: number; time: number } | null>(null);

  // Hint tracking
  const [hintsUsed, setHintsUsed] = useState({
    category: false,
    revealLetter: 0,
    eliminateLetters: false,
  });

  const {
    guesses,
    evaluations,
    currentGuess,
    status,
    keyStates,
    isRevealing,
    revealingRow,
    solution,
    message,
    elapsedTime,
    handleKeyPress,
    resetGame,
  } = useGame({ mode, wordLength });

  // Reset hints when game resets
  useEffect(() => {
    if (guesses.length === 0) {
      setHintsUsed({
        category: false,
        revealLetter: 0,
        eliminateLetters: false,
      });
    }
  }, [guesses.length]);

  // Show game end modal when game finishes
  useEffect(() => {
    if (status !== 'playing' && !isRevealing) {
      // Set pending score for leaderboard (daily mode only, wins only)
      if (status === 'won' && mode === 'daily') {
        setPendingScore({ attempts: guesses.length, time: elapsedTime });
      }
      const timer = setTimeout(() => setShowGameEnd(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [status, isRevealing, mode, guesses.length, elapsedTime]);

  // Show how to play on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('lexouli-visited');
    if (!hasVisited) {
      setShowHowToPlay(true);
      localStorage.setItem('lexouli-visited', 'true');
    }
  }, []);

  const wordLengths = Array.from(
    { length: MAX_WORD_LENGTH - MIN_WORD_LENGTH + 1 },
    (_, i) => MIN_WORD_LENGTH + i
  );

  const handlePlayAgain = () => {
    setShowGameEnd(false);
    resetGame();
  };

  const handleUseHint = (hintType: 'category' | 'revealLetter' | 'eliminateLetters') => {
    setHintsUsed(prev => ({
      ...prev,
      category: hintType === 'category' ? true : prev.category,
      revealLetter: hintType === 'revealLetter' ? prev.revealLetter + 1 : prev.revealLetter,
      eliminateLetters: hintType === 'eliminateLetters' ? true : prev.eliminateLetters,
    }));
  };

  const handleRevealLetter = (position: number, letter: string) => {
    console.log(`Reveal letter ${letter} at position ${position}`);
  };

  // Labels
  const labels = {
    daily: 'Ημερήσια',
    practice: 'Εξάσκηση',
    hint: 'Βοήθεια',
    playAgain: 'Παίξε Ξανά',
    footer: 'Μάντεψε τη λέξη σε 6 προσπάθειες',
  };

  return (
    <>
      <Header
        onOpenHowToPlay={() => setShowHowToPlay(true)}
        onOpenStats={() => setShowStats(true)}
        onOpenSettings={() => setShowSettings(true)}
      />

      <div className="flex-1 flex flex-col justify-center py-4">
        <div className="flex flex-col items-center w-full max-w-lg mx-auto px-2">
          {/* Mode & Word Length Selectors */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-4 w-full">
            {/* Mode Toggle */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setMode('daily')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === 'daily'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-green-600 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {labels.daily}
              </button>
              <button
                onClick={() => setMode('practice')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  mode === 'practice'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-green-600 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {labels.practice}
              </button>
            </div>

            {/* Word Length Selector */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              {wordLengths.map((len) => (
                <button
                  key={len}
                  onClick={() => setWordLength(len)}
                  className={`w-10 h-10 rounded-md text-sm font-medium transition-colors ${
                    wordLength === len
                      ? 'bg-white dark:bg-gray-700 shadow-sm text-green-600 dark:text-green-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>

            {/* Leaderboard Button (daily mode only) */}
            {mode === 'daily' && (
              <button
                onClick={() => setShowLeaderboard(true)}
                className="px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors flex items-center gap-2"
              >
                🏆
                <span className="hidden sm:inline">Κατάταξη</span>
              </button>
            )}
          </div>

          {/* Message Toast */}
          {message && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
              <div className="bg-black text-white px-6 py-3 rounded-lg shadow-lg font-medium">
                {message}
              </div>
            </div>
          )}

          {/* Game Board */}
          <Board
            guesses={guesses}
            evaluations={evaluations}
            currentGuess={currentGuess}
            wordLength={wordLength}
            isRevealing={isRevealing}
            revealingRow={revealingRow}
          />

          {/* Hint Button */}
          {status === 'playing' && guesses.length > 0 && (
            <button
              onClick={() => setShowHints(true)}
              className="mb-4 px-4 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-lg font-medium hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              {labels.hint}
            </button>
          )}

          {/* Play Again button (practice mode only) */}
          {mode === 'practice' && status !== 'playing' && (
            <button
              onClick={handlePlayAgain}
              className="mb-4 px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              {labels.playAgain}
            </button>
          )}

          {/* Keyboard */}
          <Keyboard
            keyStates={keyStates}
            onKeyPress={handleKeyPress}
            disabled={status !== 'playing' || isRevealing}
          />
        </div>
      </div>

      {/* Banner Ad (shows after game ends) */}
      <BannerAd show={status !== 'playing'} />

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-4 px-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {labels.footer}
        </p>
      </footer>

      {/* Modals */}
      <HowToPlay isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />
      <Stats isOpen={showStats} onClose={() => setShowStats(false)} mode={mode} wordLength={wordLength} />
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <GameEnd
        isOpen={showGameEnd}
        onClose={() => setShowGameEnd(false)}
        status={status}
        mode={mode}
        wordLength={wordLength}
        solution={solution}
        guesses={guesses}
        evaluations={evaluations}
        onPlayAgain={mode === 'practice' ? handlePlayAgain : undefined}
      />
      <HintModal
        isOpen={showHints}
        onClose={() => setShowHints(false)}
        solution={solution}
        guesses={guesses}
        evaluations={evaluations}
        keyStates={keyStates}
        hintsUsed={hintsUsed}
        onUseHint={handleUseHint}
        onRevealLetter={handleRevealLetter}
      />
      <Leaderboard
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        wordLength={wordLength}
        pendingScore={pendingScore}
        onScoreSubmitted={() => setPendingScore(null)}
      />

      {/* Debug Panel - only visible in development */}
      <DebugPanel
        solution={solution}
        wordLength={wordLength}
        onKeyPress={handleKeyPress}
        guesses={guesses}
        status={status}
        onReset={mode === 'practice' ? resetGame : undefined}
      />
    </>
  );
}
