// Leaderboard utilities

const NICKNAME_KEY = 'lexouli-nickname';

export interface LeaderboardEntry {
  nickname: string;
  attempts: number;
  time: number;
  wordLength: number;
  timestamp: number;
}

// Get stored nickname
export function getNickname(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(NICKNAME_KEY);
}

// Save nickname
export function setNickname(nickname: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NICKNAME_KEY, nickname.slice(0, 15));
}

// Fetch leaderboard
export async function fetchLeaderboard(wordLength: number): Promise<LeaderboardEntry[]> {
  try {
    const res = await fetch(`/api/leaderboard?wordLength=${wordLength}`);
    const data = await res.json();
    return data.entries || [];
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return [];
  }
}

// Submit score to leaderboard
export async function submitScore(
  nickname: string,
  attempts: number,
  time: number,
  wordLength: number
): Promise<{ success: boolean; error?: string; alreadySubmitted?: boolean }> {
  try {
    const res = await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, attempts, time, wordLength }),
    });
    return await res.json();
  } catch (error) {
    console.error('Failed to submit score:', error);
    return { success: false, error: 'Network error' };
  }
}

// Format time as MM:SS
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
