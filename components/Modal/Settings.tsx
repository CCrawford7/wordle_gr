'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import { getSettings, saveSettings, Settings as SettingsType } from '@/lib/storage';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

function Toggle({ checked, onChange, label, description }: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="font-medium text-gray-900 dark:text-white">{label}</div>
        {description && (
          <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const [settings, setSettings] = useState<SettingsType>({
    darkMode: 'system',
    defaultWordLength: 5,
    hardMode: false,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSettings(getSettings());
    }
  }, [isOpen]);

  const updateSetting = <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings({ [key]: value });

    // Handle dark mode changes
    if (key === 'darkMode') {
      if (value === true) {
        document.documentElement.classList.add('dark');
      } else if (value === false) {
        document.documentElement.classList.remove('dark');
      } else {
        // System preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', prefersDark);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ρυθμίσεις">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <Toggle
          checked={settings.hardMode}
          onChange={(checked) => updateSetting('hardMode', checked)}
          label="Δύσκολη Λειτουργία"
          description="Οι αποκαλυφθείσες υποδείξεις πρέπει να χρησιμοποιούνται σε επόμενες μαντεψιές"
        />

        <div className="py-3">
          <div className="font-medium text-gray-900 dark:text-white mb-2">Θέμα</div>
          <div className="flex gap-2">
            {[
              { value: 'system' as const, label: 'Σύστημα' },
              { value: false as const, label: 'Φωτεινό' },
              { value: true as const, label: 'Σκοτεινό' },
            ].map((option) => (
              <button
                key={String(option.value)}
                onClick={() => updateSetting('darkMode', option.value)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  settings.darkMode === option.value
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="py-3">
          <div className="font-medium text-gray-900 dark:text-white mb-2">
            Προεπιλεγμένο Μήκος Λέξης
          </div>
          <div className="flex gap-2">
            {[4, 5, 6, 7].map((length) => (
              <button
                key={length}
                onClick={() => updateSetting('defaultWordLength', length)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  settings.defaultWordLength === length
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {length}
              </button>
            ))}
          </div>
        </div>

        <div className="py-3 text-center text-xs text-gray-500 dark:text-gray-400">
          Λεξούλι v1.0.0
        </div>
      </div>
    </Modal>
  );
}
