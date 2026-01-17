// Valid Greek words for guess validation
// This is a larger list that includes all solution words plus additional valid words

import { SOLUTIONS } from './solutions';

// Additional valid words (not used as solutions but accepted as guesses)
const ADDITIONAL_VALID: Record<number, string[]> = {
  4: [
    'ΕΙΜΙ', 'ΕΙΣΙ', 'ΕΣΤΙ', 'ΗΜΗΝ', 'ΗΣΑΝ', 'ΕΣΕΙ', 'ΗΤΑΝ', 'ΕΙΧΑ',
    'ΕΙΧΕ', 'ΗΘΕΛ', 'ΠΗΓΑ', 'ΠΗΓΕ', 'ΗΡΘΑ', 'ΗΡΘΕ', 'ΕΙΠΑ', 'ΕΙΠΕ',
    'ΕΓΩΣ', 'ΕΣΥΣ', 'ΑΥΤΟ', 'ΠΟΙΟ', 'ΤΟΤΕ', 'ΤΩΡΑ', 'ΕΔΩΣ', 'ΕΚΕΙ',
    'ΠΟΥΣ', 'ΠΟΤΕ', 'ΠΩΣΣ', 'ΓΙΑΤ', 'ΟΤΑΝ', 'ΑΦΟΥ', 'ΠΡΩΙ', 'ΜΕΤΑ',
    'ΠΡΙΝ', 'ΚΑΤΩ', 'ΠΑΝΩ', 'ΜΕΣΑ', 'ΕΞΩΣ', 'ΓΥΡΩ', 'ΔΙΠΛ', 'ΑΠΛΑ',
  ],
  5: [
    'ΕΙΜΑΙ', 'ΕΙΣΑΙ', 'ΕΙΝΑΙ', 'ΗΜΟΥΝ', 'ΗΣΟΥΝ', 'ΗΘΕΛΑ', 'ΠΗΓΑΜ',
    'ΗΡΘΑΜ', 'ΕΙΠΑΜ', 'ΕΜΕΙΣ', 'ΕΣΕΙΣ', 'ΑΥΤΟΙ', 'ΑΥΤΕΣ', 'ΑΥΤΑΣ',
    'ΠΟΙΟΣ', 'ΠΟΙΑΣ', 'ΤΩΡΑΣ', 'ΕΔΩΣΕ', 'ΕΚΕΙΣ', 'ΠΟΤΕΣ', 'ΠΩΣΣΣ',
    'ΓΙΑΤΙ', 'ΟΤΑΝΣ', 'ΑΦΟΥΣ', 'ΠΡΩΤΑ', 'ΜΕΤΑΣ', 'ΠΡΙΝΣ', 'ΚΑΤΩΣ',
    'ΠΑΝΩΣ', 'ΜΕΣΑΣ', 'ΕΞΩΣΣ', 'ΓΥΡΩΣ', 'ΔΙΠΛΑ', 'ΑΠΛΩΣ', 'ΤΕΛΟΣ',
  ],
  6: [
    'ΕΙΜΑΣΤ', 'ΕΙΣΑΣΤ', 'ΗΜΑΣΤΑ', 'ΗΣΑΣΤΑ', 'ΗΘΕΛΑΜ', 'ΠΗΓΑΜΕΣ',
    'ΗΡΘΑΜΕ', 'ΕΙΠΑΜΕ', 'ΕΜΕΙΣΣ', 'ΕΣΕΙΣΣ', 'ΑΥΤΟΥΣ', 'ΕΚΕΙΝΟ',
    'ΕΚΕΙΝΗ', 'ΕΚΕΙΝΑ', 'ΚΑΠΟΙΟ', 'ΚΑΜΙΑΣ', 'ΚΑΝΕΝΑ', 'ΤΙΠΟΤΑ',
    'ΟΛΟΚΛΗ', 'ΟΛΙΚΟΣ', 'ΜΕΡΙΚΟ', 'ΛΙΓΟΣΤ', 'ΑΡΚΕΤΑ', 'ΠΟΛΛΟΙ',
  ],
  7: [
    'ΕΙΜΑΣΤΕ', 'ΕΙΣΑΣΤΕ', 'ΗΜΑΣΤΑΝ', 'ΗΣΑΣΤΑΝ', 'ΗΘΕΛΑΜΕ', 'ΠΗΓΑΙΝΕ',
    'ΕΡΧΟΤΑΝ', 'ΕΛΕΓΑΜΕ', 'ΕΜΕΙΣΣΣ', 'ΕΣΕΙΣΣΣ', 'ΑΥΤΟΥΣΣ', 'ΕΚΕΙΝΟΙ',
    'ΕΚΕΙΝΕΣ', 'ΕΚΕΙΝΩΝ', 'ΚΑΠΟΙΟΣ', 'ΚΑΠΟΙΑΣ', 'ΚΑΝΕΝΑΣ', 'ΤΙΠΟΤΑΣ',
    'ΟΛΟΚΛΗΡ', 'ΜΕΡΙΚΟΙ', 'ΛΙΓΟΣΤΟ', 'ΑΡΚΕΤΟΙ', 'ΠΟΛΛΟΥΣ', 'ΛΙΓΟΤΕΡ',
  ],
};

// Build the complete valid words set
function buildValidWordsSet(wordLength: number): Set<string> {
  const solutions = SOLUTIONS[wordLength] || [];
  const additional = ADDITIONAL_VALID[wordLength] || [];
  return new Set([...solutions, ...additional]);
}

// Cache the sets for performance
const VALID_WORDS_CACHE: Record<number, Set<string>> = {};

export function getValidWords(wordLength: number): Set<string> {
  if (!VALID_WORDS_CACHE[wordLength]) {
    VALID_WORDS_CACHE[wordLength] = buildValidWordsSet(wordLength);
  }
  return VALID_WORDS_CACHE[wordLength];
}

export function isValidWord(word: string, wordLength: number): boolean {
  const validWords = getValidWords(wordLength);
  return validWords.has(word.toUpperCase());
}
