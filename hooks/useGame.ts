'use client';

import { useState, useCallback, useEffect } from 'react';
import { GameMode, GameStatus, MAX_GUESSES, TileState } from '@/lib/constants';
import { evaluateGuess, getKeyboardStates, isCorrectGuess, normalizeGreek } from '@/lib/game-logic';
import { isValidWord } from '@/lib/words/valid-words';
import { getDailyWord, getRandomWord } from '@/lib/daily';
import {
  getDailyState,
  saveDailyState,
  getPracticeState,
  savePracticeState,
  clearPracticeState,
  updateStats,
  getTodayString,
} from '@/lib/storage';

interface UseGameOptions {
  mode: GameMode;
  wordLength: number;
}

interface UseGameReturn {
  guesses: string[];
  evaluations: TileState[][];
  currentGuess: string;
  status: GameStatus;
  keyStates: Map<string, TileState>;
  isRevealing: boolean;
  revealingRow: number;
  solution: string;
  message: string | null;
  handleKeyPress: (key: string) => void;
  resetGame: () => void;
}

export function useGame({ mode, wordLength }: UseGameOptions): UseGameReturn {
  const [solution, setSolution] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [evaluations, setEvaluations] = useState<TileState[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [status, setStatus] = useState<GameStatus>('playing');
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const [revealingRow, setRevealingRow] = useState<number>(-1);
  const [message, setMessage] = useState<string | null>(null);

  // Initialize game
  useEffect(() => {
    if (mode === 'daily') {
      const savedState = getDailyState(wordLength);
      if (savedState && savedState.date === getTodayString()) {
        setSolution(savedState.solution);
        setGuesses(savedState.guesses);
        setEvaluations(savedState.evaluations);
        setStatus(savedState.status);
        setCurrentGuess('');
        setMessage(null);
        return;
      }

      // New game
      const word = getDailyWord(wordLength);
      setSolution(word);
      setGuesses([]);
      setEvaluations([]);
      setStatus('playing');
    } else {
      const savedState = getPracticeState(wordLength);
      if (savedState && savedState.status === 'playing') {
        setSolution(savedState.solution);
        setGuesses(savedState.guesses);
        setEvaluations(savedState.evaluations);
        setStatus(savedState.status);
        setCurrentGuess('');
        setMessage(null);
        return;
      }

      const word = getRandomWord(wordLength);
      setSolution(word);
      setGuesses([]);
      setEvaluations([]);
      setStatus('playing');
      clearPracticeState(wordLength);
    }
    setCurrentGuess('');
    setMessage(null);
  }, [mode, wordLength]);

  // Calculate keyboard states
  const keyStates = getKeyboardStates(guesses, evaluations);

  // Save state when it changes
  useEffect(() => {
    if (!solution) return;

    if (mode === 'daily') {
      saveDailyState({
        date: getTodayString(),
        wordLength,
        guesses,
        evaluations,
        status,
        solution,
      });
    } else {
      savePracticeState({
        wordLength,
        guesses,
        evaluations,
        status,
        solution,
      });
    }
  }, [mode, wordLength, guesses, evaluations, status, solution]);

  // Show message temporarily
  const showMessage = useCallback((msg: string, duration: number = 2000) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), duration);
  }, []);

  // Handle key press
  const handleKeyPress = useCallback((key: string) => {
    if (status !== 'playing' || isRevealing) return;

    if (key === 'ENTER') {
      if (currentGuess.length !== wordLength) {
        showMessage('Πολύ σύντομη λέξη');
        return;
      }

      const normalizedGuess = normalizeGreek(currentGuess);

      // Check if word is valid
      if (!isValidWord(normalizedGuess, wordLength)) {
        showMessage('Άγνωστη λέξη');
        return;
      }

      // Evaluate guess
      const evaluation = evaluateGuess(currentGuess, solution);
      const newGuesses = [...guesses, normalizedGuess];
      const newEvaluations = [...evaluations, evaluation];

      // Start reveal animation
      setIsRevealing(true);
      setRevealingRow(guesses.length);

      // After animation completes
      setTimeout(() => {
        setGuesses(newGuesses);
        setEvaluations(newEvaluations);
        setCurrentGuess('');
        setIsRevealing(false);
        setRevealingRow(-1);

        // Check win/lose
        if (isCorrectGuess(currentGuess, solution)) {
          setStatus('won');
          updateStats(mode, wordLength, true, newGuesses.length);
          showMessage('Μπράβο! 🎉', 3000);
        } else if (newGuesses.length >= MAX_GUESSES) {
          setStatus('lost');
          updateStats(mode, wordLength, false, newGuesses.length);
          showMessage(`Η λέξη ήταν: ${solution}`, 5000);
        }
      }, wordLength * 300 + 300);

    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < wordLength) {
      // Add letter
      setCurrentGuess(prev => prev + key);
    }
  }, [status, isRevealing, currentGuess, wordLength, solution, guesses, evaluations, mode, showMessage]);

  // Handle physical keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyPress('BACKSPACE');
      } else {
        const key = e.key.toUpperCase();
        const greekLetterRegex = /^[ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ]$/;
        if (greekLetterRegex.test(key)) {
          handleKeyPress(key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  // Reset game (for practice mode)
  const resetGame = useCallback(() => {
    if (mode === 'practice') {
      const word = getRandomWord(wordLength);
      setSolution(word);
      setGuesses([]);
      setEvaluations([]);
      setCurrentGuess('');
      setStatus('playing');
      setMessage(null);
      clearPracticeState(wordLength);
    }
  }, [mode, wordLength]);

  return {
    guesses,
    evaluations,
    currentGuess,
    status,
    keyStates,
    isRevealing,
    revealingRow,
    solution,
    message,
    handleKeyPress,
    resetGame,
  };
}
