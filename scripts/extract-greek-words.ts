/**
 * Extract and process Greek words from frequency list
 * Filters for valid Wordle-style words (4-7 letters)
 */

import * as fs from 'fs';
import * as path from 'path';

// Greek letter normalization map (remove accents)
const ACCENT_MAP: Record<string, string> = {
  'ά': 'α', 'έ': 'ε', 'ή': 'η', 'ί': 'ι', 'ό': 'ο', 'ύ': 'υ', 'ώ': 'ω',
  'Ά': 'Α', 'Έ': 'Ε', 'Ή': 'Η', 'Ί': 'Ι', 'Ό': 'Ο', 'Ύ': 'Υ', 'Ώ': 'Ω',
  'ΐ': 'ι', 'ΰ': 'υ', 'ϊ': 'ι', 'ϋ': 'υ', 'Ϊ': 'Ι', 'Ϋ': 'Υ',
};

// English names transliterated to Greek (from subtitles)
const ENGLISH_NAMES = new Set([
  // Common first names
  'τζον', 'τζων', 'μπεν', 'σαμ', 'μαικ', 'μπιλ', 'τζακ', 'τζεικ', 'τζιμ', 'τζο',
  'τζεφ', 'τζεισ', 'μπομπ', 'ντεν', 'νταν', 'ντον', 'ρομπ', 'τομ', 'τζορτζ',
  'κρισ', 'κλερ', 'λισα', 'σαρα', 'μαρι', 'αννα', 'τζεν', 'κειτ', 'λορα',
  'εντι', 'μπρι', 'τζιλ', 'τζος', 'τζαν', 'ριτσ', 'ματσ', 'χανσ', 'μορσ',
  'φλιν', 'πιρσ', 'χιλσ', 'βινσ', 'μιτσ', 'γκασ', 'λανσ', 'μαρσ', 'μουρ',
  'χολμσ', 'μπλερ', 'φιντσ', 'κλαιρ', 'ρθουρ', 'λισον', 'γκλεν', 'γκριν',
  'τσαρλσ', 'γκιμπσ', 'μπρουσ', 'τζουλσ', 'μπερνσ', 'μπαρνσ', 'ντριου',
  'ντζελα', 'ντζελες', 'ντζελο', 'μπριγκσ', 'μπρουκσ', 'ντερσον', 'γουντσ',
  'μπανκσ', 'ντισον', 'αρθουρ', 'ντραμσ', 'μπουτσ', 'φραντσ', 'μπλανσ',
  'ολιβερ', 'ροτζερ', 'ντριαν', 'νταμσ', 'ντικσ', 'ρτσερ', 'χιουν', 'τρανσ',
  'ντατσ', 'χομπσ', 'τανκσ', 'ριγκσ', 'γκνεσ', 'ντους', 'σεντσ', 'ντρου',
  'στρεσ', 'μπιτσ', 'μπουσ', 'ντονι', 'ντρεσ', 'λιντσ', 'ντρεα', 'τσανσ',
  'βαταρ', 'μπλου', 'ντρασ', 'τζουν', 'μπαμπα', 'μπαμπασ', 'μπερνσ',
  'γκιουν', 'σταρ', 'σταν', 'νιου', 'σπορ', 'φλασ', 'σκορ', 'μπασ', 'μπαρ',
  'τζιν', 'ντιν', 'κριν', 'γιου', 'γιοι', 'νουντλσ', 'μπραντσ', 'ντριουσ',
  'τζιχιον', 'νθρωποι', 'νθρωποσ', // These are truncated versions of ΑΝΘΡΩΠΟΙ
]);

// Function words to exclude (articles, pronouns, prepositions, conjunctions, particles)
const EXCLUDE_WORDS = new Set([
  // Articles
  'ο', 'η', 'το', 'οι', 'τα', 'του', 'της', 'των', 'τον', 'την', 'τους', 'τις',
  // Pronouns
  'εγω', 'εσυ', 'αυτος', 'αυτη', 'αυτο', 'εμεις', 'εσεις', 'αυτοι', 'αυτες', 'αυτα',
  'μου', 'σου', 'του', 'της', 'μας', 'σας', 'τους',
  'με', 'σε', 'τον', 'την', 'το', 'μας', 'σας', 'τους', 'τις', 'τα',
  'εμενα', 'εσενα', 'αυτον', 'αυτην', 'εμας', 'εσας',
  'μενα', 'σενα',
  'ποιος', 'ποια', 'ποιο', 'ποιοι', 'ποιες', 'ποια',
  'τι', 'ποτε', 'που', 'πως', 'πού', 'πώς',
  'κατι', 'καποιος', 'καποια', 'καποιο', 'κανεις', 'καμια', 'κανενα',
  'ολος', 'ολη', 'ολο', 'ολοι', 'ολες', 'ολα',
  'αλλος', 'αλλη', 'αλλο', 'αλλοι', 'αλλες', 'αλλα',
  // Prepositions
  'σε', 'απο', 'για', 'με', 'προς', 'κατα', 'μετα', 'παρα', 'αντι', 'υπερ',
  'στο', 'στη', 'στον', 'στην', 'στα', 'στις', 'στους',
  'απ',
  // Conjunctions
  'και', 'αλλα', 'η', 'ή', 'ουτε', 'μητε', 'ειτε', 'οτι', 'οτι', 'πως',
  'αν', 'οταν', 'επειδη', 'αφου', 'μολις', 'ενω', 'καθως', 'ωστε', 'για',
  'μα', 'ομως', 'παρα', 'λοιπον', 'αρα', 'επομενως',
  'κι', 'κ', 'γι', 'σ', 'μ', 'τ', 'ν',
  // Particles and common function words
  'να', 'θα', 'δεν', 'δε', 'μην', 'μη', 'ας',
  'ναι', 'οχι', 'ισως',
  'πολυ', 'λιγο', 'πιο', 'πλεον', 'καλα',
  'τωρα', 'εδω', 'εκει', 'ποτε', 'παντα', 'μονο', 'μαζι', 'ακομα', 'μολις',
  'πανω', 'κατω', 'μεσα', 'εξω', 'πισω', 'μπρος', 'γυρω', 'μετα', 'πριν',
  'τοσο', 'ετσι', 'οπως', 'σαν',
  // Common verbs that are too short or function-like
  'ειναι', 'ειμαι', 'εισαι', 'ειμαστε', 'ειστε',
  'ηταν', 'ημουν', 'ησουν', 'ημασταν', 'ησασταν',
  'εχω', 'εχεις', 'εχει', 'εχουμε', 'εχετε', 'εχουν',
  'ειχα', 'ειχες', 'ειχε', 'ειχαμε', 'ειχατε', 'ειχαν',
  // Numbers
  'ενα', 'ενας', 'μια', 'δυο', 'τρια', 'τρεις', 'τεσσερα', 'πεντε',
  // Interjections
  'ευχαριστω', 'παρακαλω', 'γεια', 'εντάξει', 'ενταξει',
]);

// Valid Greek letters only
const GREEK_LETTERS = /^[αβγδεζηθικλμνξοπρστυφχψω]+$/i;

function normalizeGreek(word: string): string {
  let normalized = word.toLowerCase();
  for (const [accented, plain] of Object.entries(ACCENT_MAP)) {
    normalized = normalized.replace(new RegExp(accented, 'g'), plain);
  }
  return normalized.toUpperCase();
}

function isValidGreekWord(word: string): boolean {
  // Must be only Greek letters
  if (!GREEK_LETTERS.test(word)) return false;

  // Must not be in exclude list
  const normalized = word.toLowerCase();
  if (EXCLUDE_WORDS.has(normalized)) return false;

  // Must not be an English name
  if (ENGLISH_NAMES.has(normalized)) return false;

  // Filter out words that look truncated (start with consonant clusters)
  // Greek words rarely start with these patterns
  const truncatedPatterns = [
    /^ρθ/, /^ρχ/, /^ργ/, /^λλ/, /^γγ/, /^νθ/, /^κτ/, /^πτ/, /^φτ/, /^χτ/,
    /^νν/, /^ρρ/, /^σσ/, /^ππ/, /^ττ/, /^κκ/, /^μμ/,
  ];
  if (truncatedPatterns.some(p => p.test(normalized))) return false;

  return true;
}

// Valid word endings for Greek (filters out truncated words)
function hasValidEnding(word: string): boolean {
  const lastChar = word.slice(-1);
  const lastTwo = word.slice(-2);

  // Most Greek words end in vowels
  const vowels = ['Α', 'Ε', 'Η', 'Ι', 'Ο', 'Υ', 'Ω'];
  if (vowels.includes(lastChar)) return true;

  // Or Σ, Ν, Ρ
  if (['Σ', 'Ν', 'Ρ'].includes(lastChar)) return true;

  // Some valid consonant endings
  const validConsonantEndings = ['ΑΣ', 'ΕΣ', 'ΗΣ', 'ΙΣ', 'ΟΣ', 'ΥΣ', 'ΩΣ', 'ΩΝ', 'ΕΝ', 'ΟΝ', 'ΑΝ', 'ΙΝ'];
  if (validConsonantEndings.some(e => word.endsWith(e))) return true;

  return false;
}

async function main() {
  const inputFile = '/tmp/greek_words.txt';
  const content = fs.readFileSync(inputFile, 'utf-8');
  const lines = content.trim().split('\n');

  const wordsByLength: Record<number, Array<{ word: string; freq: number; original: string }>> = {
    4: [],
    5: [],
    6: [],
    7: [],
  };

  for (const line of lines) {
    const parts = line.split(' ');
    if (parts.length < 2) continue;

    const original = parts[0];
    const freq = parseInt(parts[1]);

    if (!isValidGreekWord(original)) continue;

    const normalized = normalizeGreek(original);
    const len = normalized.length;

    if (len < 4 || len > 7) continue;
    if (!hasValidEnding(normalized)) continue;

    // Check for repeated letters at end (padding)
    if (/(.)\1$/.test(normalized)) continue;

    // Avoid words that are likely verb conjugations (end in common verb suffixes)
    // We want base forms primarily
    const verbSuffixes = ['ΟΥΝ', 'ΑΝΕ', 'ΕΤΕ', 'ΑΤΕ', 'ΟΥΜ', 'ΑΜΕ', 'ΟΥΜΕ', 'ΕΙΤΕ', 'ΟΥΣΑ', 'ΟΥΣΕ'];
    const isVerbConjugation = verbSuffixes.some(s => normalized.endsWith(s));

    wordsByLength[len].push({ word: normalized, freq, original });
  }

  // Sort by frequency and deduplicate
  for (const len of [4, 5, 6, 7]) {
    const words = wordsByLength[len];

    // Sort by frequency (highest first)
    words.sort((a, b) => b.freq - a.freq);

    // Deduplicate
    const seen = new Set<string>();
    wordsByLength[len] = words.filter(w => {
      if (seen.has(w.word)) return false;
      seen.add(w.word);
      return true;
    });
  }

  // Output results
  console.log('='.repeat(60));
  console.log('EXTRACTED GREEK WORDS BY LENGTH');
  console.log('='.repeat(60));

  for (const len of [4, 5, 6, 7]) {
    const words = wordsByLength[len];
    console.log(`\n${len}-LETTER WORDS: ${words.length} total`);
    console.log('-'.repeat(40));

    // Show top 50
    console.log('Top 50 by frequency:');
    words.slice(0, 50).forEach((w, i) => {
      console.log(`  ${(i+1).toString().padStart(2)}. ${w.word} (${w.original}, freq: ${w.freq})`);
    });
  }

  // Generate TypeScript output for solutions
  console.log('\n' + '='.repeat(60));
  console.log('SOLUTIONS FILE OUTPUT');
  console.log('='.repeat(60));

  // For solutions, take top N words per length
  const SOLUTIONS_COUNT = { 4: 150, 5: 200, 6: 200, 7: 150 };

  console.log('\nexport const SOLUTIONS: Record<number, string[]> = {');
  for (const len of [4, 5, 6, 7]) {
    const count = SOLUTIONS_COUNT[len as keyof typeof SOLUTIONS_COUNT];
    const words = wordsByLength[len].slice(0, count).map(w => w.word);

    console.log(`  ${len}: [`);
    // Print in rows of 8
    for (let i = 0; i < words.length; i += 8) {
      const row = words.slice(i, i + 8).map(w => `'${w}'`).join(', ');
      console.log(`    ${row},`);
    }
    console.log(`  ],`);
  }
  console.log('};');

  // Write to file
  const outputDir = path.join(__dirname, '../lib/words');

  // Generate solutions
  let solutionsContent = `// Greek word solutions - extracted from frequency data
// Common words suitable for Wordle-style game
// Generated from OpenSubtitles frequency list

export const SOLUTIONS: Record<number, string[]> = {\n`;

  for (const len of [4, 5, 6, 7]) {
    const count = SOLUTIONS_COUNT[len as keyof typeof SOLUTIONS_COUNT];
    const words = wordsByLength[len].slice(0, count).map(w => w.word);

    solutionsContent += `  ${len}: [\n`;
    for (let i = 0; i < words.length; i += 8) {
      const row = words.slice(i, i + 8).map(w => `'${w}'`).join(', ');
      solutionsContent += `    ${row},\n`;
    }
    solutionsContent += `  ],\n`;
  }
  solutionsContent += `};\n\nexport function getSolutions(wordLength: number): string[] {\n  return SOLUTIONS[wordLength] || [];\n}\n`;

  fs.writeFileSync(path.join(outputDir, 'solutions-new.ts'), solutionsContent);
  console.log('\nWritten to lib/words/solutions-new.ts');

  // For valid words, include more (solutions + additional common words)
  const VALID_COUNT = { 4: 500, 5: 800, 6: 800, 7: 500 };

  let validContent = `// Valid Greek words for guess validation
// Includes solution words plus additional common words
// Generated from OpenSubtitles frequency list

import { SOLUTIONS } from './solutions-new';

const ADDITIONAL_VALID: Record<number, string[]> = {\n`;

  for (const len of [4, 5, 6, 7]) {
    const solCount = SOLUTIONS_COUNT[len as keyof typeof SOLUTIONS_COUNT];
    const validCount = VALID_COUNT[len as keyof typeof VALID_COUNT];
    const additionalWords = wordsByLength[len].slice(solCount, validCount).map(w => w.word);

    validContent += `  ${len}: [\n`;
    for (let i = 0; i < additionalWords.length; i += 8) {
      const row = additionalWords.slice(i, i + 8).map(w => `'${w}'`).join(', ');
      validContent += `    ${row},\n`;
    }
    validContent += `  ],\n`;
  }
  validContent += `};

function buildValidWordsSet(wordLength: number): Set<string> {
  const solutions = SOLUTIONS[wordLength] || [];
  const additional = ADDITIONAL_VALID[wordLength] || [];
  return new Set([...solutions, ...additional]);
}

const VALID_WORDS_CACHE: Record<number, Set<string>> = {};

export function getValidWords(wordLength: number): Set<string> {
  if (!VALID_WORDS_CACHE[wordLength]) {
    VALID_WORDS_CACHE[wordLength] = buildValidWordsSet(wordLength);
  }
  return VALID_WORDS_CACHE[wordLength];
}

export function isValidWord(word: string, wordLength: number): boolean {
  // In development, skip validation if enabled
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    if (localStorage.getItem('lexouli-skip-validation') === 'true') {
      return true;
    }
  }

  const validWords = getValidWords(wordLength);
  const upperWord = word.toUpperCase();

  if (validWords.has(upperWord)) {
    return true;
  }

  // In development, also check localStorage for temporarily added words
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    try {
      const customWords = JSON.parse(localStorage.getItem('lexouli-debug-words') || '[]');
      if (customWords.includes(upperWord)) {
        return true;
      }
    } catch {
      // Ignore parse errors
    }
  }

  return false;
}

// Debug helpers (development only)
export function addDebugWord(word: string): void {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;
  try {
    const customWords = JSON.parse(localStorage.getItem('lexouli-debug-words') || '[]');
    const upperWord = word.toUpperCase();
    if (!customWords.includes(upperWord)) {
      customWords.push(upperWord);
      localStorage.setItem('lexouli-debug-words', JSON.stringify(customWords));
    }
  } catch {}
}

export function getDebugWords(): string[] {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return [];
  try {
    return JSON.parse(localStorage.getItem('lexouli-debug-words') || '[]');
  } catch {
    return [];
  }
}

export function trackRejectedWord(word: string): void {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;
  try {
    const rejectedWords = JSON.parse(localStorage.getItem('lexouli-rejected-words') || '[]');
    const upperWord = word.toUpperCase();
    if (!rejectedWords.includes(upperWord)) {
      rejectedWords.push(upperWord);
      localStorage.setItem('lexouli-rejected-words', JSON.stringify(rejectedWords));
    }
  } catch {}
}

export function getRejectedWords(): string[] {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return [];
  try {
    return JSON.parse(localStorage.getItem('lexouli-rejected-words') || '[]');
  } catch {
    return [];
  }
}

export function clearRejectedWords(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('lexouli-rejected-words');
}

export function isSkipValidationEnabled(): boolean {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return false;
  return localStorage.getItem('lexouli-skip-validation') === 'true';
}

export function setSkipValidation(enabled: boolean): void {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;
  localStorage.setItem('lexouli-skip-validation', enabled ? 'true' : 'false');
}
`;

  fs.writeFileSync(path.join(outputDir, 'valid-words-new.ts'), validContent);
  console.log('Written to lib/words/valid-words-new.ts');

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  for (const len of [4, 5, 6, 7]) {
    const solCount = Math.min(wordsByLength[len].length, SOLUTIONS_COUNT[len as keyof typeof SOLUTIONS_COUNT]);
    const validCount = Math.min(wordsByLength[len].length, VALID_COUNT[len as keyof typeof VALID_COUNT]);
    console.log(`${len}-letter: ${solCount} solutions, ${validCount} valid words total`);
  }
}

main().catch(console.error);
