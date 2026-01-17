'use client';

import { useState, useCallback, useEffect } from 'react';
import { GameMode, GameStatus, MAX_GUESSES, TileState, Language } from '@/lib/constants';
import { evaluateGuess, getKeyboardStates, isCorrectGuess, normalizeGreek } from '@/lib/game-logic';
import { isValidWord } from '@/lib/words/valid-words';
import { isValidWordEN } from '@/lib/words/valid-words-en';
import { getDailyWord, getRandomWord } from '@/lib/daily';
import { getSolutionsEN } from '@/lib/words/solutions-en';
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
  language: Language;
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

// Get daily word for English
function getDailyWordEN(wordLength: number, date: Date = new Date()): string {
  const solutions = getSolutionsEN(wordLength);
  if (solutions.length === 0) {
    throw new Error(`No English solutions for word length ${wordLength}`);
  }
  const msPerDay = 24 * 60 * 60 * 1000;
  const epoch = new Date('2025-01-01T00:00:00Z');
  const dayNumber = Math.floor((date.getTime() - epoch.getTime()) / msPerDay);
  const seed = dayNumber * 10 + wordLength;
  const index = Math.abs(seed * 1103515245 + 12345) % solutions.length;
  return solutions[index];
}

// Get random word for English
function getRandomWordEN(wordLength: number): string {
  const solutions = getSolutionsEN(wordLength);
  if (solutions.length === 0) {
    throw new Error(`No English solutions for word length ${wordLength}`);
  }
  return solutions[Math.floor(Math.random() * solutions.length)];
}

export function useGame({ mode, wordLength, language }: UseGameOptions): UseGameReturn {
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
    const storageKey = `${language}-${wordLength}`;

    if (mode === 'daily') {
      const savedState = getDailyState(wordLength);
      // Check if saved state matches current language
      if (savedState && savedState.solution) {
        const isGreekSolution = /[ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ]/.test(savedState.solution);
        const matchesLanguage = (language === 'el' && isGreekSolution) || (language === 'en' && !isGreekSolution);

        if (matchesLanguage && savedState.date === getTodayString()) {
          setSolution(savedState.solution);
          setGuesses(savedState.guesses);
          setEvaluations(savedState.evaluations);
          setStatus(savedState.status);
          setCurrentGuess('');
          setMessage(null);
          return;
        }
      }

      // New game
      const word = language === 'el' ? getDailyWord(wordLength) : getDailyWordEN(wordLength);
      setSolution(word);
      setGuesses([]);
      setEvaluations([]);
      setStatus('playing');
    } else {
      const savedState = getPracticeState(wordLength);
      if (savedState && savedState.status === 'playing') {
        const isGreekSolution = /[ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ]/.test(savedState.solution);
        const matchesLanguage = (language === 'el' && isGreekSolution) || (language === 'en' && !isGreekSolution);

        if (matchesLanguage) {
          setSolution(savedState.solution);
          setGuesses(savedState.guesses);
          setEvaluations(savedState.evaluations);
          setStatus(savedState.status);
          setCurrentGuess('');
          setMessage(null);
          return;
        }
      }

      const word = language === 'el' ? getRandomWord(wordLength) : getRandomWordEN(wordLength);
      setSolution(word);
      setGuesses([]);
      setEvaluations([]);
      setStatus('playing');
      clearPracticeState(wordLength);
    }
    setCurrentGuess('');
    setMessage(null);
  }, [mode, wordLength, language]);

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
        showMessage(language === 'el' ? 'Πολύ σύντομη λέξη' : 'Too short');
        return;
      }

      const normalizedGuess = language === 'el'
        ? normalizeGreek(currentGuess)
        : currentGuess.toUpperCase();

      // Check if word is valid
      const isValid = language === 'el'
        ? isValidWord(normalizedGuess, wordLength)
        : isValidWordEN(normalizedGuess, wordLength);

      if (!isValid) {
        showMessage(language === 'el' ? 'Άγνωστη λέξη' : 'Not in word list');
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
          showMessage(language === 'el' ? 'Μπράβο! 🎉' : 'Excellent! 🎉', 3000);
        } else if (newGuesses.length >= MAX_GUESSES) {
          setStatus('lost');
          updateStats(mode, wordLength, false, newGuesses.length);
          showMessage(language === 'el' ? `Η λέξη ήταν: ${solution}` : `The word was: ${solution}`, 5000);
        }
      }, wordLength * 300 + 300);

    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < wordLength) {
      // Add letter
      setCurrentGuess(prev => prev + key);
    }
  }, [status, isRevealing, currentGuess, wordLength, solution, guesses, evaluations, mode, language, showMessage]);

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
        if (language === 'el') {
          const greekLetterRegex = /^[ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ]$/;
          if (greekLetterRegex.test(key)) {
            handleKeyPress(key);
          }
        } else {
          const englishLetterRegex = /^[A-Z]$/;
          if (englishLetterRegex.test(key)) {
            handleKeyPress(key);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, language]);

  // Reset game (for practice mode)
  const resetGame = useCallback(() => {
    if (mode === 'practice') {
      const word = language === 'el' ? getRandomWord(wordLength) : getRandomWordEN(wordLength);
      setSolution(word);
      setGuesses([]);
      setEvaluations([]);
      setCurrentGuess('');
      setStatus('playing');
      setMessage(null);
      clearPracticeState(wordLength);
    }
  }, [mode, wordLength, language]);

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
