/**
 * Audit script to find potentially invalid Greek words in the solutions list
 *
 * Checks for:
 * 1. Doubled letters at the end (padding like ΚΩΣΣ)
 * 2. Unusual consonant endings for Greek
 * 3. Truncated words (incomplete stems)
 * 4. Repeated letter sequences
 */

import { SOLUTIONS } from '../lib/words/solutions';

// Greek vowels
const VOWELS = new Set(['Α', 'Ε', 'Η', 'Ι', 'Ο', 'Υ', 'Ω']);

// Common valid Greek word endings
const VALID_ENDINGS = [
  // Noun endings
  'ΟΣ', 'ΑΣ', 'ΗΣ', 'ΕΣ', 'ΟΥ', 'ΩΝ', 'ΕΙ', 'ΟΙ', 'ΑΙ',
  'Α', 'Η', 'Ο', 'Ι', 'Υ', 'Ε', 'Ω',
  'ΜΑ', 'ΤΑ', 'ΝΑ', 'ΡΑ', 'ΛΑ', 'ΣΑ', 'ΖΑ', 'ΞΑ', 'ΨΑ',
  'ΜΟ', 'ΤΟ', 'ΝΟ', 'ΡΟ', 'ΛΟ', 'ΣΟ', 'ΖΟ',
  'ΜΗ', 'ΤΗ', 'ΝΗ', 'ΡΗ', 'ΛΗ', 'ΣΗ', 'ΞΗ', 'ΨΗ',
  'ΜΙ', 'ΤΙ', 'ΝΙ', 'ΡΙ', 'ΛΙ', 'ΣΙ', 'ΔΙ', 'ΚΙ', 'ΠΙ', 'ΦΙ',
  // Verb endings
  'ΕΙΣ', 'ΟΥΝ', 'ΑΝΕ', 'ΟΥΜ', 'ΑΜΕ', 'ΑΤΕ', 'ΕΤΕ', 'ΟΝΤ',
  'ΩΝΩ', 'ΕΙΩ', 'ΑΩ', 'ΩΣ', 'ΑΣΕ', 'ΗΣΕ', 'ΩΣΕ',
  // Adjective endings
  'ΙΚΟ', 'ΙΚΗ', 'ΙΚΑ', 'ΙΝΟ', 'ΙΝΗ', 'ΙΝΑ',
  // Common endings
  'ΤΩΡ', 'ΤΗΡ', 'ΤΡΑ', 'ΤΡΟ',
];

// Suspicious patterns (likely truncated or padded)
const SUSPICIOUS_PATTERNS = [
  /(.)\1{2,}$/,        // 3+ repeated letters at end (ΚΩΣΣΣ)
  /(.)\1$/,            // 2 repeated letters at end (less strict, flag for review)
  /[ΒΓΔΖΘΚΛΜΝΞΠΡΣΤΦΧΨ]{3,}$/, // 3+ consonants at end
  /[ΒΓΔΖΘΚΛΜΝΞΠΡΣΤΦΧΨ]$/,     // Ends in single consonant (many are truncated)
];

// Words that are clearly truncated stems
const TRUNCATED_PATTERNS = [
  /^[Α-Ω]+[ΒΓΔΖΘΚΛΜΝΞΠΡΣΤΦΧΨ]$/, // Ends in consonant
];

interface AuditResult {
  word: string;
  length: number;
  issues: string[];
}

function auditWord(word: string): string[] {
  const issues: string[] = [];

  // Check for doubled letters at end
  if (/(.)\1$/.test(word)) {
    const lastTwo = word.slice(-2);
    if (lastTwo[0] === lastTwo[1]) {
      issues.push(`Doubled letter at end: ${lastTwo}`);
    }
  }

  // Check for triple+ repeated letters
  if (/(.)\1{2,}/.test(word)) {
    issues.push('Triple+ repeated letters');
  }

  // Check for unusual consonant endings
  const lastChar = word.slice(-1);
  const lastTwo = word.slice(-2);

  // Most Greek words end in vowels, Σ, Ν, or specific patterns
  if (!VOWELS.has(lastChar) && !['Σ', 'Ν', 'Ρ'].includes(lastChar)) {
    // Check if it's a valid ending
    const hasValidEnding = VALID_ENDINGS.some(ending => word.endsWith(ending));
    if (!hasValidEnding) {
      issues.push(`Unusual ending: -${lastTwo}`);
    }
  }

  // Check for consonant clusters at end (unusual in Greek)
  if (/[ΒΓΔΖΘΚΛΜΝΞΠΡΣΤΦΧΨ]{2,}$/.test(word) && !word.endsWith('ΝΣ') && !word.endsWith('ΡΣ')) {
    issues.push(`Consonant cluster at end`);
  }

  // Flag words ending in single consonant (except Σ, Ν, Ρ)
  if (/[ΒΓΔΖΘΚΛΜΞΠΤΦΧΨ]$/.test(word)) {
    issues.push('Ends in unusual consonant (likely truncated)');
  }

  return issues;
}

function runAudit() {
  const results: AuditResult[] = [];
  let totalWords = 0;
  let problematicWords = 0;

  console.log('='.repeat(60));
  console.log('GREEK WORD LIST AUDIT REPORT');
  console.log('='.repeat(60));
  console.log('');

  for (const [lengthStr, words] of Object.entries(SOLUTIONS)) {
    const length = parseInt(lengthStr);
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`${length}-LETTER WORDS (${words.length} total)`);
    console.log('─'.repeat(60));

    const issuesForLength: AuditResult[] = [];

    for (const word of words) {
      totalWords++;
      const issues = auditWord(word);

      if (issues.length > 0) {
        problematicWords++;
        issuesForLength.push({ word, length, issues });
      }
    }

    if (issuesForLength.length === 0) {
      console.log('✓ No issues found');
    } else {
      console.log(`⚠ ${issuesForLength.length} potentially invalid words:\n`);

      for (const { word, issues } of issuesForLength) {
        console.log(`  ${word}`);
        for (const issue of issues) {
          console.log(`    └─ ${issue}`);
        }
      }
    }

    results.push(...issuesForLength);
  }

  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total words audited: ${totalWords}`);
  console.log(`Potentially invalid: ${problematicWords} (${((problematicWords/totalWords)*100).toFixed(1)}%)`);
  console.log('');

  // Group by issue type
  const issueTypes: Record<string, string[]> = {};
  for (const { word, issues } of results) {
    for (const issue of issues) {
      const type = issue.split(':')[0];
      if (!issueTypes[type]) issueTypes[type] = [];
      issueTypes[type].push(word);
    }
  }

  console.log('Issues by type:');
  for (const [type, words] of Object.entries(issueTypes)) {
    console.log(`  ${type}: ${words.length} words`);
  }

  return results;
}

runAudit();
