import { ACCENT_MAP, TileState } from './constants';

/**
 * Normalize Greek text by:
 * - Converting to uppercase
 * - Removing accents
 * - Converting final sigma (ς) to regular sigma (σ)
 */
export function normalizeGreek(text: string): string {
  return text
    .toUpperCase()
    .split('')
    .map(char => ACCENT_MAP[char] || char)
    .join('');
}

/**
 * Evaluate a guess against the solution
 * Returns an array of tile states for each letter position
 */
export function evaluateGuess(guess: string, solution: string): TileState[] {
  const normalizedGuess = normalizeGreek(guess);
  const normalizedSolution = normalizeGreek(solution);

  const result: TileState[] = new Array(normalizedGuess.length).fill('absent');
  const solutionChars = normalizedSolution.split('');
  const remainingChars: (string | null)[] = [...solutionChars];

  // First pass: mark correct positions (green)
  for (let i = 0; i < normalizedGuess.length; i++) {
    if (normalizedGuess[i] === normalizedSolution[i]) {
      result[i] = 'correct';
      remainingChars[i] = null; // Mark as used
    }
  }

  // Second pass: mark present but wrong position (yellow)
  for (let i = 0; i < normalizedGuess.length; i++) {
    if (result[i] === 'correct') continue;

    const charIndex = remainingChars.indexOf(normalizedGuess[i]);
    if (charIndex !== -1) {
      result[i] = 'present';
      remainingChars[charIndex] = null; // Mark as used
    }
  }

  return result;
}

/**
 * Get the state of each letter on the keyboard based on all guesses
 * Returns a map of letter -> best state (correct > present > absent)
 */
export function getKeyboardStates(
  guesses: string[],
  evaluations: TileState[][]
): Map<string, TileState> {
  const states = new Map<string, TileState>();

  guesses.forEach((guess, guessIndex) => {
    const normalizedGuess = normalizeGreek(guess);
    const evaluation = evaluations[guessIndex];

    normalizedGuess.split('').forEach((letter, letterIndex) => {
      const currentState = states.get(letter);
      const newState = evaluation[letterIndex];

      // Priority: correct > present > absent
      if (!currentState ||
          newState === 'correct' ||
          (newState === 'present' && currentState === 'absent')) {
        states.set(letter, newState);
      }
    });
  });

  return states;
}

/**
 * Check if a guess is valid (correct length, all Greek letters)
 */
export function isValidGuess(guess: string, wordLength: number): boolean {
  if (guess.length !== wordLength) return false;

  const normalizedGuess = normalizeGreek(guess);
  const greekLetterRegex = /^[ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ]+$/;

  return greekLetterRegex.test(normalizedGuess);
}

/**
 * Check if the guess matches the solution
 */
export function isCorrectGuess(guess: string, solution: string): boolean {
  return normalizeGreek(guess) === normalizeGreek(solution);
}

/**
 * Generate share text for a completed game
 */
export function generateShareText(
  evaluations: TileState[][],
  wordLength: number,
  gameNumber: number,
  won: boolean
): string {
  const attempts = won ? evaluations.length : 'X';
  const header = `Λεξούλι #${gameNumber} (${wordLength}) ${attempts}/6\n\n`;

  const grid = evaluations.map(evaluation =>
    evaluation.map(state => {
      switch (state) {
        case 'correct': return '🟩';
        case 'present': return '🟨';
        default: return '⬛';
      }
    }).join('')
  ).join('\n');

  return header + grid + '\n\nwordlegr.co';
}
