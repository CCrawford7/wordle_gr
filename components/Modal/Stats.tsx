'use client';

import Modal from './Modal';
import { GameMode } from '@/lib/constants';
import { getStats, GameStats } from '@/lib/storage';

interface StatsProps {
  isOpen: boolean;
  onClose: () => void;
  mode: GameMode;
  wordLength: number;
}

function StatBox({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {label}
      </div>
    </div>
  );
}

function DistributionBar({ guess, count, max, highlight }: { guess: number; count: number; max: number; highlight?: boolean }) {
  const width = max > 0 ? Math.max((count / max) * 100, 8) : 8;

  return (
    <div className="flex items-center gap-2">
      <div className="w-4 text-sm font-medium text-gray-600 dark:text-gray-400">
        {guess}
      </div>
      <div className="flex-1">
        <div
          className={`h-5 flex items-center justify-end px-2 text-xs font-medium text-white rounded-sm transition-all ${
            highlight ? 'bg-green-500' : 'bg-gray-500'
          }`}
          style={{ width: `${width}%` }}
        >
          {count}
        </div>
      </div>
    </div>
  );
}

export default function Stats({ isOpen, onClose, mode, wordLength }: StatsProps) {
  const stats: GameStats = typeof window !== 'undefined'
    ? getStats(mode, wordLength)
    : { played: 0, won: 0, currentStreak: 0, maxStreak: 0, distribution: [0, 0, 0, 0, 0, 0] };

  const winPercentage = stats.played > 0
    ? Math.round((stats.won / stats.played) * 100)
    : 0;

  const maxDistribution = Math.max(...stats.distribution);

  const modeLabel = mode === 'daily' ? 'Ημερήσια' : 'Εξάσκηση';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Στατιστικά">
      <div className="space-y-6">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          {modeLabel} · {wordLength} γράμματα
        </div>

        {/* Main stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatBox value={stats.played} label="Παιχνίδια" />
          <StatBox value={winPercentage} label="Νίκες %" />
          <StatBox value={stats.currentStreak} label="Σερί" />
          <StatBox value={stats.maxStreak} label="Μέγιστο" />
        </div>

        {/* Distribution */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Κατανομή Μαντεψιών
          </h3>
          <div className="space-y-1">
            {stats.distribution.map((count, i) => (
              <DistributionBar
                key={i}
                guess={i + 1}
                count={count}
                max={maxDistribution}
              />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
