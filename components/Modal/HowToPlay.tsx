'use client';

import Modal from './Modal';

interface HowToPlayProps {
  isOpen: boolean;
  onClose: () => void;
}

function ExampleTile({ letter, state }: { letter: string; state: 'correct' | 'present' | 'absent' }) {
  const stateClasses = {
    correct: 'bg-green-500 border-green-500 text-white',
    present: 'bg-yellow-500 border-yellow-500 text-white',
    absent: 'bg-gray-500 border-gray-500 text-white',
  };

  return (
    <div className={`w-10 h-10 flex items-center justify-center text-lg font-bold border-2 rounded ${stateClasses[state]}`}>
      {letter}
    </div>
  );
}

function ExampleRow({ word, states }: { word: string; states: ('correct' | 'present' | 'absent')[] }) {
  return (
    <div className="flex gap-1">
      {word.split('').map((letter, i) => (
        <ExampleTile key={i} letter={letter} state={states[i]} />
      ))}
    </div>
  );
}

export default function HowToPlay({ isOpen, onClose }: HowToPlayProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Πώς να παίξεις">
      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <p>
          Μάντεψε τη <strong>Λεξούλι</strong> σε 6 προσπάθειες.
        </p>

        <p>
          Κάθε μαντεψιά πρέπει να είναι μια έγκυρη ελληνική λέξη. Πάτα <strong>ENTER</strong> για να υποβάλεις.
        </p>

        <p>
          Μετά από κάθε μαντεψιά, τα χρώματα των πλακιδίων θα αλλάξουν για να σου δείξουν πόσο κοντά είσαι στη λέξη.
        </p>

        <hr className="border-gray-200 dark:border-gray-700" />

        <div className="space-y-3">
          <p className="font-semibold">Παραδείγματα</p>

          <div className="space-y-2">
            <ExampleRow word="ΛΟΓΟΣ" states={['correct', 'absent', 'absent', 'absent', 'absent']} />
            <p className="text-sm">
              Το <strong>Λ</strong> είναι στη λέξη και στη σωστή θέση.
            </p>
          </div>

          <div className="space-y-2">
            <ExampleRow word="ΜΕΡΑΣ" states={['absent', 'present', 'absent', 'absent', 'absent']} />
            <p className="text-sm">
              Το <strong>Ε</strong> είναι στη λέξη αλλά σε λάθος θέση.
            </p>
          </div>

          <div className="space-y-2">
            <ExampleRow word="ΠΟΛΙΣ" states={['absent', 'absent', 'absent', 'absent', 'absent']} />
            <p className="text-sm">
              Κανένα γράμμα δεν είναι στη λέξη.
            </p>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        <div className="space-y-2">
          <p className="font-semibold">Λειτουργίες παιχνιδιού</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Ημερήσια:</strong> Μία λέξη την ημέρα - η ίδια για όλους!</li>
            <li><strong>Εξάσκηση:</strong> Απεριόριστες λέξεις για εξάσκηση.</li>
            <li>Διάλεξε μήκος λέξης: 4, 5, 6 ή 7 γράμματα.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
