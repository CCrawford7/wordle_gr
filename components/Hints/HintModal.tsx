'use client';

import { useState } from 'react';
import Modal from '../Modal/Modal';
import { TileState } from '@/lib/constants';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  solution: string;
  guesses: string[];
  evaluations: TileState[][];
  keyStates: Map<string, TileState>;
  onRevealLetter: (position: number, letter: string) => void;
  hintsUsed: {
    category: boolean;
    revealLetter: number;
    eliminateLetters: boolean;
  };
  onUseHint: (hintType: 'category' | 'revealLetter' | 'eliminateLetters') => void;
}

// Word categories for free hint (placeholder - would be expanded)
const WORD_CATEGORIES: Record<string, string[]> = {
  'Φύση': ['ΝΕΡΟ', 'ΔΕΝΤΡ', 'ΑΝΕΜΟ', 'ΗΛΙΟΣ', 'ΘΑΛΑΣΣ', 'ΒΟΥΝΑ', 'ΠΟΤΑΜΙ'],
  'Σπίτι': ['ΣΠΙΤΙ', 'ΠΟΡΤΑ', 'ΤΟΙΧΟΣ', 'ΚΗΠΟΣ', 'ΔΩΜΑΤΙ'],
  'Συναισθήματα': ['ΑΓΑΠΗ', 'ΧΑΡΑΣ', 'ΛΥΠΗΣ', 'ΦΟΒΟΣ', 'ΘΥΜΟΣ', 'ΕΛΠΙΔΑ'],
  'Τροφή': ['ΨΩΜΙΑ', 'ΤΥΡΙΑ', 'ΚΡΕΑΣ', 'ΦΡΟΥΤ', 'ΚΑΦΕΣ', 'ΓΑΛΑΚ'],
};

function getWordCategory(word: string): string | null {
  const normalizedWord = word.toUpperCase();
  for (const [category, words] of Object.entries(WORD_CATEGORIES)) {
    if (words.some(w => normalizedWord.startsWith(w) || w.startsWith(normalizedWord))) {
      return category;
    }
  }
  return null;
}

export default function HintModal({
  isOpen,
  onClose,
  solution,
  guesses,
  evaluations,
  keyStates,
  hintsUsed,
  onUseHint,
}: HintModalProps) {
  const [showingAd, setShowingAd] = useState(false);
  const [pendingHint, setPendingHint] = useState<'revealLetter' | 'eliminateLetters' | null>(null);

  const category = getWordCategory(solution);

  // Find unrevealed positions
  const revealedPositions = new Set<number>();
  evaluations.forEach((evaluation) => {
    evaluation.forEach((state, idx) => {
      if (state === 'correct') revealedPositions.add(idx);
    });
  });

  const unrevealedPositions = Array.from(
    { length: solution.length },
    (_, i) => i
  ).filter(i => !revealedPositions.has(i));

  // Find letters to eliminate (not in solution, not already guessed)
  const solutionLetters = new Set(solution.toUpperCase().split(''));
  const allGreekLetters = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'];
  const eliminatableLetters = allGreekLetters
    .filter(letter => !keyStates.has(letter)) // Not yet guessed
    .filter(letter => !solutionLetters.has(letter)) // Not in solution
    .slice(0, 3);

  const simulateRewardedAd = (onComplete: () => void) => {
    setShowingAd(true);
    // Simulate ad watching (3 seconds)
    setTimeout(() => {
      setShowingAd(false);
      onComplete();
    }, 3000);
  };

  const handlePaidHint = (hintType: 'revealLetter' | 'eliminateLetters') => {
    setPendingHint(hintType);
    simulateRewardedAd(() => {
      onUseHint(hintType);
      setPendingHint(null);
      onClose();
    });
  };

  const handleCategoryHint = () => {
    onUseHint('category');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Βοήθεια">
      <div className="space-y-4">
        {showingAd ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Παρακολούθηση διαφήμισης...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              (Προσομοίωση - 3 δευτερόλεπτα)
            </p>
          </div>
        ) : (
          <>
            {/* Free hint - Category */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Κατηγορία Λέξης
                </h3>
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                  ΔΩΡΕΑΝ
                </span>
              </div>
              {hintsUsed.category ? (
                <p className="text-gray-600 dark:text-gray-400">
                  {category ? `Η λέξη σχετίζεται με: ${category}` : 'Γενική λέξη'}
                </p>
              ) : (
                <button
                  onClick={handleCategoryHint}
                  className="w-full py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Δες την κατηγορία
                </button>
              )}
            </div>

            {/* Paid hint - Reveal letter */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Αποκάλυψε Γράμμα
                </h3>
                <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                  ΔΙΑΦΗΜΙΣΗ
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Αποκαλύπτει ένα σωστό γράμμα στη θέση του
              </p>
              {unrevealedPositions.length > 0 ? (
                <button
                  onClick={() => handlePaidHint('revealLetter')}
                  disabled={pendingHint === 'revealLetter'}
                  className="w-full py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50"
                >
                  {hintsUsed.revealLetter > 0
                    ? `Αποκάλυψε άλλο (${hintsUsed.revealLetter} χρησιμοποιήθηκαν)`
                    : 'Δες διαφήμιση για βοήθεια'}
                </button>
              ) : (
                <p className="text-green-600 dark:text-green-400 text-sm">
                  Όλα τα γράμματα έχουν αποκαλυφθεί!
                </p>
              )}
            </div>

            {/* Paid hint - Eliminate letters */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Αποκλεισμός Γραμμάτων
                </h3>
                <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                  ΔΙΑΦΗΜΙΣΗ
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Σβήνει 3 λάθος γράμματα από το πληκτρολόγιο
              </p>
              {!hintsUsed.eliminateLetters && eliminatableLetters.length >= 3 ? (
                <button
                  onClick={() => handlePaidHint('eliminateLetters')}
                  disabled={pendingHint === 'eliminateLetters'}
                  className="w-full py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50"
                >
                  Δες διαφήμιση για βοήθεια
                </button>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {hintsUsed.eliminateLetters
                    ? 'Ήδη χρησιμοποιήθηκε'
                    : 'Δεν υπάρχουν αρκετά γράμματα για αποκλεισμό'}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
