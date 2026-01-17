// Greek alphabet and keyboard layout for Λεξούλι

export const GREEK_ALPHABET = [
  'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ',
  'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'
] as const;

// Greek keyboard layout (standard Greek QWERTY)
export const KEYBOARD_ROWS_GR = [
  ['Ε', 'Ρ', 'Τ', 'Υ', 'Θ', 'Ι', 'Ο', 'Π'],
  ['Α', 'Σ', 'Δ', 'Φ', 'Γ', 'Η', 'Ξ', 'Κ', 'Λ'],
  ['Ζ', 'Χ', 'Ψ', 'Ω', 'Β', 'Ν', 'Μ']
] as const;

// English keyboard layout (QWERTY)
export const KEYBOARD_ROWS_EN = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
] as const;

// Language type
export type Language = 'el' | 'en';

// Map of accented characters to their base form
export const ACCENT_MAP: Record<string, string> = {
  'Ά': 'Α', 'ά': 'α',
  'Έ': 'Ε', 'έ': 'ε',
  'Ή': 'Η', 'ή': 'η',
  'Ί': 'Ι', 'ί': 'ι', 'Ϊ': 'Ι', 'ϊ': 'ι', 'ΐ': 'ι',
  'Ό': 'Ο', 'ό': 'ο',
  'Ύ': 'Υ', 'ύ': 'υ', 'Ϋ': 'Υ', 'ϋ': 'υ', 'ΰ': 'υ',
  'Ώ': 'Ω', 'ώ': 'ω',
  'ς': 'σ', // final sigma to regular sigma
};

// Game configuration
export const MAX_GUESSES = 6;
export const MIN_WORD_LENGTH = 4;
export const MAX_WORD_LENGTH = 7;
export const DEFAULT_WORD_LENGTH = 5;

// Tile states
export type TileState = 'empty' | 'tbd' | 'correct' | 'present' | 'absent';

// Game state
export type GameStatus = 'playing' | 'won' | 'lost';

// Game mode
export type GameMode = 'daily' | 'practice';

// Local storage keys
export const STORAGE_KEYS = {
  DAILY_STATE: 'lexouli-daily',
  PRACTICE_STATE: 'lexouli-practice',
  STATS: 'lexouli-stats',
  SETTINGS: 'lexouli-settings',
} as const;

// Colors for sharing
export const SHARE_COLORS = {
  correct: '🟩',
  present: '🟨',
  absent: '⬛',
} as const;
