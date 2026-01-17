import { GameMode, GameStatus, TileState } from './constants';

// Types for stored data
export interface DailyGameState {
  date: string; // ISO date string (YYYY-MM-DD)
  wordLength: number;
  guesses: string[];
  evaluations: TileState[][];
  status: GameStatus;
  solution: string;
}

export interface PracticeGameState {
  wordLength: number;
  guesses: string[];
  evaluations: TileState[][];
  status: GameStatus;
  solution: string;
}

export interface GameStats {
  played: number;
  won: number;
  currentStreak: number;
  maxStreak: number;
  distribution: number[]; // Array of 6 numbers for guesses 1-6
}

export interface Settings {
  darkMode: boolean | 'system';
  defaultWordLength: number;
  hardMode: boolean;
}

// Storage keys
const DAILY_STATE_KEY = 'lexouli-daily';
const PRACTICE_STATE_KEY = 'lexouli-practice';
const STATS_KEY = 'lexouli-stats';
const SETTINGS_KEY = 'lexouli-settings';

// Helper to check if we're in browser
const isBrowser = typeof window !== 'undefined';

// Get today's date as YYYY-MM-DD
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// Daily game state
export function getDailyState(wordLength: number): DailyGameState | null {
  if (!isBrowser) return null;
  try {
    const stored = localStorage.getItem(`${DAILY_STATE_KEY}-${wordLength}`);
    if (!stored) return null;
    const state = JSON.parse(stored) as DailyGameState;
    // Return null if it's from a different day
    if (state.date !== getTodayString()) return null;
    return state;
  } catch {
    return null;
  }
}

export function saveDailyState(state: DailyGameState): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(
      `${DAILY_STATE_KEY}-${state.wordLength}`,
      JSON.stringify(state)
    );
  } catch {
    console.error('Failed to save daily state');
  }
}

// Practice game state
export function getPracticeState(wordLength: number): PracticeGameState | null {
  if (!isBrowser) return null;
  try {
    const stored = localStorage.getItem(`${PRACTICE_STATE_KEY}-${wordLength}`);
    if (!stored) return null;
    return JSON.parse(stored) as PracticeGameState;
  } catch {
    return null;
  }
}

export function savePracticeState(state: PracticeGameState): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(
      `${PRACTICE_STATE_KEY}-${state.wordLength}`,
      JSON.stringify(state)
    );
  } catch {
    console.error('Failed to save practice state');
  }
}

export function clearPracticeState(wordLength: number): void {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(`${PRACTICE_STATE_KEY}-${wordLength}`);
  } catch {
    console.error('Failed to clear practice state');
  }
}

// Statistics
export function getStats(mode: GameMode, wordLength: number): GameStats {
  if (!isBrowser) {
    return createEmptyStats();
  }
  try {
    const stored = localStorage.getItem(`${STATS_KEY}-${mode}-${wordLength}`);
    if (!stored) return createEmptyStats();
    return JSON.parse(stored) as GameStats;
  } catch {
    return createEmptyStats();
  }
}

export function saveStats(mode: GameMode, wordLength: number, stats: GameStats): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(`${STATS_KEY}-${mode}-${wordLength}`, JSON.stringify(stats));
  } catch {
    console.error('Failed to save stats');
  }
}

export function createEmptyStats(): GameStats {
  return {
    played: 0,
    won: 0,
    currentStreak: 0,
    maxStreak: 0,
    distribution: [0, 0, 0, 0, 0, 0],
  };
}

export function updateStats(
  mode: GameMode,
  wordLength: number,
  won: boolean,
  guessCount: number
): GameStats {
  const stats = getStats(mode, wordLength);

  stats.played += 1;

  if (won) {
    stats.won += 1;
    stats.currentStreak += 1;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    stats.distribution[guessCount - 1] += 1;
  } else {
    stats.currentStreak = 0;
  }

  saveStats(mode, wordLength, stats);
  return stats;
}

// Settings
export function getSettings(): Settings {
  if (!isBrowser) {
    return createDefaultSettings();
  }
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return createDefaultSettings();
    return { ...createDefaultSettings(), ...JSON.parse(stored) };
  } catch {
    return createDefaultSettings();
  }
}

export function saveSettings(settings: Partial<Settings>): void {
  if (!isBrowser) return;
  try {
    const current = getSettings();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...settings }));
  } catch {
    console.error('Failed to save settings');
  }
}

function createDefaultSettings(): Settings {
  return {
    darkMode: 'system',
    defaultWordLength: 5,
    hardMode: false,
  };
}
