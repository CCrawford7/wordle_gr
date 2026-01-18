'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import {
  LeaderboardEntry,
  fetchLeaderboard,
  submitScore,
  getNickname,
  setNickname,
  formatTime,
} from '@/lib/leaderboard';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
  wordLength: number;
  // For submitting score after a win
  pendingScore?: {
    attempts: number;
    time: number;
  } | null;
  onScoreSubmitted?: () => void;
}

export default function Leaderboard({
  isOpen,
  onClose,
  wordLength,
  pendingScore,
  onScoreSubmitted,
}: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNicknameState] = useState('');
  const [nicknameInput, setNicknameInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load nickname and leaderboard on open
  useEffect(() => {
    if (isOpen) {
      const stored = getNickname();
      if (stored) {
        setNicknameState(stored);
        setNicknameInput(stored);
      }
      loadLeaderboard();
    }
  }, [isOpen, wordLength]);

  const loadLeaderboard = async () => {
    setLoading(true);
    const data = await fetchLeaderboard(wordLength);
    setEntries(data);
    setLoading(false);
  };

  const handleSubmitScore = async () => {
    if (!nicknameInput.trim() || !pendingScore) return;

    const name = nicknameInput.trim();
    if (name.length < 2 || name.length > 15) {
      setError('Το ψευδώνυμο πρέπει να είναι 2-15 χαρακτήρες');
      return;
    }

    setSubmitting(true);
    setError(null);

    // Save nickname for future
    setNickname(name);
    setNicknameState(name);

    const result = await submitScore(
      name,
      pendingScore.attempts,
      pendingScore.time,
      wordLength
    );

    setSubmitting(false);

    if (result.success) {
      setSubmitted(true);
      onScoreSubmitted?.();
      loadLeaderboard();
    } else if (result.alreadySubmitted) {
      setError('Έχεις ήδη υποβάλει σκορ σήμερα');
      setSubmitted(true);
    } else {
      setError(result.error || 'Αποτυχία υποβολής');
    }
  };

  const currentUserNickname = getNickname()?.toLowerCase();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Κατάταξη Ημέρας 🏆">
      <div className="space-y-4">
        {/* Submit score section */}
        {pendingScore && !submitted && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-sm text-green-700 dark:text-green-300 mb-2">
              Μπράβο! Βρήκες τη λέξη σε <strong>{pendingScore.attempts}</strong> προσπάθειες
              ({formatTime(pendingScore.time)})
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                placeholder="Ψευδώνυμο..."
                maxLength={15}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm"
              />
              <button
                onClick={handleSubmitScore}
                disabled={submitting || !nicknameInput.trim()}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {submitting ? '...' : 'Υποβολή'}
              </button>
            </div>
            {error && (
              <div className="text-xs text-red-500 mt-2">{error}</div>
            )}
          </div>
        )}

        {submitted && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300 text-center">
            ✓ Το σκορ σου καταχωρήθηκε!
          </div>
        )}

        {/* Leaderboard table */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 grid grid-cols-12 gap-2">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Παίκτης</div>
            <div className="col-span-3 text-center">Προσπ.</div>
            <div className="col-span-3 text-right">Χρόνος</div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-green-500 rounded-full mx-auto"></div>
            </div>
          ) : entries.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
              Κανένα σκορ ακόμα σήμερα.
              <br />
              Γίνε ο πρώτος!
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {entries.map((entry, index) => {
                const isCurrentUser = entry.nickname.toLowerCase() === currentUserNickname;
                return (
                  <div
                    key={`${entry.nickname}-${entry.timestamp}`}
                    className={`px-4 py-3 grid grid-cols-12 gap-2 text-sm ${
                      isCurrentUser
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : index % 2 === 0
                        ? 'bg-white dark:bg-gray-900'
                        : 'bg-gray-50 dark:bg-gray-800/50'
                    }`}
                  >
                    <div className="col-span-1 font-medium text-gray-500">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </div>
                    <div className={`col-span-5 font-medium truncate ${
                      isCurrentUser ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'
                    }`}>
                      {entry.nickname}
                      {isCurrentUser && ' (εσύ)'}
                    </div>
                    <div className="col-span-3 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        entry.attempts === 1 ? 'bg-green-500 text-white' :
                        entry.attempts === 2 ? 'bg-green-400 text-white' :
                        entry.attempts === 3 ? 'bg-yellow-400 text-black' :
                        entry.attempts === 4 ? 'bg-yellow-500 text-black' :
                        entry.attempts === 5 ? 'bg-orange-400 text-white' :
                        'bg-orange-500 text-white'
                      }`}>
                        {entry.attempts}
                      </span>
                    </div>
                    <div className="col-span-3 text-right text-gray-500 dark:text-gray-400 font-mono text-xs">
                      {formatTime(entry.time)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
          Η κατάταξη ανανεώνεται κάθε μέρα στις 00:00
        </div>
      </div>
    </Modal>
  );
}
