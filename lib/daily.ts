import { getSolutions } from './words/solutions';

// Epoch date for daily word calculation (Jan 1, 2025)
const EPOCH_DATE = new Date('2025-01-01T00:00:00Z');

/**
 * Get the day number since epoch
 */
export function getDayNumber(date: Date = new Date()): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const diff = date.getTime() - EPOCH_DATE.getTime();
  return Math.floor(diff / msPerDay);
}

/**
 * Simple seeded random number generator
 */
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

/**
 * Get the daily word for a specific date and word length
 * Uses deterministic selection based on date + word length
 */
export function getDailyWord(wordLength: number, date: Date = new Date()): string {
  const dayNumber = getDayNumber(date);
  const solutions = getSolutions(wordLength);

  if (solutions.length === 0) {
    throw new Error(`No solutions available for word length ${wordLength}`);
  }

  // Create a unique seed combining day number and word length
  const seed = dayNumber * 10 + wordLength;
  const random = seededRandom(seed);

  // Select a word using the seeded random
  const index = Math.floor(random() * solutions.length);
  return solutions[index];
}

/**
 * Get the game number for display
 */
export function getGameNumber(wordLength: number, date: Date = new Date()): number {
  return getDayNumber(date) * 10 + wordLength;
}

/**
 * Get time until next daily word (midnight UTC)
 */
export function getTimeUntilNextWord(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);

  const diff = tomorrow.getTime() - now.getTime();

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

/**
 * Get a random word for practice mode
 */
export function getRandomWord(wordLength: number): string {
  const solutions = getSolutions(wordLength);

  if (solutions.length === 0) {
    throw new Error(`No solutions available for word length ${wordLength}`);
  }

  const index = Math.floor(Math.random() * solutions.length);
  return solutions[index];
}
