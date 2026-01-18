'use client';

import { useState, useEffect } from 'react';
import { addDebugWord, getDebugWords, getRejectedWords, clearRejectedWords } from '@/lib/words/valid-words';

interface DebugPanelProps {
  solution: string;
  wordLength: number;
  onKeyPress: (key: string) => void;
  guesses: string[];
  status: 'playing' | 'won' | 'lost';
  onReset?: () => void;
}

export default function DebugPanel({
  solution,
  wordLength,
  onKeyPress,
  guesses,
  status,
  onReset,
}: DebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'game' | 'words'>('game');
  const [customWord, setCustomWord] = useState('');
  const [newValidWord, setNewValidWord] = useState('');
  const [debugWords, setDebugWords] = useState<string[]>([]);
  const [rejectedWords, setRejectedWords] = useState<string[]>([]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Load debug and rejected words
  useEffect(() => {
    const loadWords = () => {
      setDebugWords(getDebugWords());
      setRejectedWords(getRejectedWords());
    };
    loadWords();
    // Refresh every second to catch new rejected words
    const interval = setInterval(loadWords, 1000);
    return () => clearInterval(interval);
  }, []);

  const fillWord = (word: string) => {
    // Clear current guess first
    for (let i = 0; i < wordLength; i++) {
      onKeyPress('BACKSPACE');
    }
    // Type the word
    for (const letter of word.toUpperCase()) {
      onKeyPress(letter);
    }
  };

  const submitWord = (word: string) => {
    fillWord(word);
    setTimeout(() => onKeyPress('ENTER'), 100);
  };

  const autoWin = () => {
    submitWord(solution);
  };

  const fillWrongGuess = () => {
    const wrongLetters = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'
      .split('')
      .filter(l => !solution.includes(l))
      .slice(0, wordLength)
      .join('');
    fillWord(wrongLetters || 'ΑΒΓΔΕ'.slice(0, wordLength));
  };

  const testAllStates = () => {
    const testWord = solution.split('').map((letter, i) => {
      if (i === 0) return letter;
      if (i === 1) return solution[solution.length - 1];
      return 'Ω';
    }).join('');
    submitWord(testWord.slice(0, wordLength));
  };

  const handleAddDebugWord = (word: string) => {
    addDebugWord(word);
    setDebugWords(getDebugWords());
    setNewValidWord('');
  };

  const handleClearRejected = () => {
    clearRejectedWords();
    setRejectedWords([]);
  };

  const copyRejectedToClipboard = () => {
    const formatted = rejectedWords.map(w => `'${w}'`).join(', ');
    navigator.clipboard.writeText(formatted);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg hover:bg-purple-700"
      >
        {isExpanded ? '🔧 Hide Debug' : '🔧 Debug'}
      </button>

      {isExpanded && (
        <div className="mt-2 bg-gray-900 text-white p-4 rounded-lg shadow-xl text-sm w-80 max-h-[80vh] overflow-y-auto">
          <h3 className="font-bold text-purple-400 mb-2">Debug Panel</h3>

          {/* Tabs */}
          <div className="flex gap-1 mb-3">
            <button
              onClick={() => setActiveTab('game')}
              className={`px-3 py-1 rounded text-xs ${activeTab === 'game' ? 'bg-purple-600' : 'bg-gray-700'}`}
            >
              Game
            </button>
            <button
              onClick={() => setActiveTab('words')}
              className={`px-3 py-1 rounded text-xs ${activeTab === 'words' ? 'bg-purple-600' : 'bg-gray-700'}`}
            >
              Words {rejectedWords.length > 0 && `(${rejectedWords.length})`}
            </button>
          </div>

          {activeTab === 'game' && (
            <>
              {/* Solution Display */}
              <div className="mb-3 p-2 bg-gray-800 rounded">
                <span className="text-gray-400 text-xs">Solution:</span>
                <div className="font-mono text-lg text-green-400 tracking-wider">
                  {solution}
                </div>
              </div>

              {/* Game State */}
              <div className="mb-3 text-xs">
                <span className="text-gray-400">Status:</span>{' '}
                <span className={
                  status === 'won' ? 'text-green-400' :
                  status === 'lost' ? 'text-red-400' :
                  'text-yellow-400'
                }>
                  {status.toUpperCase()}
                </span>
                <span className="text-gray-400 ml-2">Guesses:</span>{' '}
                <span className="text-white">{guesses.length}/6</span>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <div className="text-xs text-gray-400 mb-1">Quick Actions:</div>

                <button
                  onClick={autoWin}
                  disabled={status !== 'playing'}
                  className="w-full px-2 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs"
                >
                  ✓ Auto Win (Enter Solution)
                </button>

                <button
                  onClick={fillWrongGuess}
                  disabled={status !== 'playing'}
                  className="w-full px-2 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs"
                >
                  ✗ Fill Wrong Guess
                </button>

                <button
                  onClick={testAllStates}
                  disabled={status !== 'playing'}
                  className="w-full px-2 py-1 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs"
                >
                  🎨 Test Tile States
                </button>

                {onReset && (
                  <button
                    onClick={onReset}
                    className="w-full px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                  >
                    🔄 Reset Game
                  </button>
                )}
              </div>

              {/* Custom Word Input */}
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="text-xs text-gray-400 mb-1">Custom Word:</div>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={customWord}
                    onChange={(e) => setCustomWord(e.target.value.toUpperCase())}
                    placeholder={`${wordLength} letters...`}
                    maxLength={wordLength}
                    className="flex-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs font-mono"
                  />
                  <button
                    onClick={() => fillWord(customWord)}
                    disabled={customWord.length !== wordLength || status !== 'playing'}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded text-xs"
                  >
                    Fill
                  </button>
                  <button
                    onClick={() => submitWord(customWord)}
                    disabled={customWord.length !== wordLength || status !== 'playing'}
                    className="px-2 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded text-xs"
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* Previous Guesses */}
              {guesses.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="text-xs text-gray-400 mb-1">Guesses:</div>
                  <div className="font-mono text-xs space-y-1">
                    {guesses.map((guess, i) => (
                      <div key={i} className="text-gray-300">
                        {i + 1}. {guess}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'words' && (
            <>
              {/* Add Debug Word */}
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">Add word to accept temporarily:</div>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={newValidWord}
                    onChange={(e) => setNewValidWord(e.target.value.toUpperCase())}
                    placeholder="Enter word..."
                    className="flex-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs font-mono"
                  />
                  <button
                    onClick={() => handleAddDebugWord(newValidWord)}
                    disabled={newValidWord.length < 4 || newValidWord.length > 7}
                    className="px-2 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Debug Words (temporarily accepted) */}
              {debugWords.length > 0 && (
                <div className="mb-3 p-2 bg-gray-800 rounded">
                  <div className="text-xs text-green-400 mb-1">Temporarily Accepted ({debugWords.length}):</div>
                  <div className="font-mono text-xs text-gray-300 flex flex-wrap gap-1">
                    {debugWords.map((word, i) => (
                      <span key={i} className="bg-green-900 px-1 rounded">{word}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejected Words */}
              <div className="p-2 bg-gray-800 rounded">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-red-400">Rejected Words ({rejectedWords.length}):</span>
                  {rejectedWords.length > 0 && (
                    <div className="flex gap-1">
                      <button
                        onClick={copyRejectedToClipboard}
                        className="px-1 py-0.5 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                        title="Copy to clipboard"
                      >
                        📋
                      </button>
                      <button
                        onClick={handleClearRejected}
                        className="px-1 py-0.5 bg-red-600 hover:bg-red-700 rounded text-xs"
                        title="Clear list"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
                {rejectedWords.length === 0 ? (
                  <div className="text-xs text-gray-500 italic">No rejected words yet. Try guessing invalid words!</div>
                ) : (
                  <div className="font-mono text-xs text-gray-300 flex flex-wrap gap-1">
                    {rejectedWords.map((word, i) => (
                      <span
                        key={i}
                        className="bg-red-900 px-1 rounded cursor-pointer hover:bg-green-900"
                        onClick={() => handleAddDebugWord(word)}
                        title="Click to accept this word"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  💡 Click a rejected word to temporarily accept it
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
