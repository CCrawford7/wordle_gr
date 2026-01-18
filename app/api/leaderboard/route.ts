import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export interface LeaderboardEntry {
  nickname: string;
  attempts: number;
  time: number; // seconds to complete
  wordLength: number;
  timestamp: number;
}

function getTodayKey(wordLength: number): string {
  const today = new Date().toISOString().split('T')[0];
  return `leaderboard:${today}:${wordLength}`;
}

// GET - Fetch today's leaderboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wordLength = parseInt(searchParams.get('wordLength') || '5');

    // Check if KV is configured
    if (!process.env.KV_REST_API_URL) {
      return NextResponse.json({ entries: [], error: 'Leaderboard not configured' });
    }

    const key = getTodayKey(wordLength);
    const entries: LeaderboardEntry[] = await kv.lrange(key, 0, 49) || [];

    // Sort by attempts (fewer is better), then by time (faster is better)
    const sorted = entries.sort((a, b) => {
      if (a.attempts !== b.attempts) return a.attempts - b.attempts;
      return a.time - b.time;
    });

    return NextResponse.json({ entries: sorted.slice(0, 20) });
  } catch (error) {
    console.error('Leaderboard GET error:', error);
    return NextResponse.json({ entries: [], error: 'Failed to fetch leaderboard' });
  }
}

// POST - Submit a score
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nickname, attempts, time, wordLength } = body;

    // Validate input
    if (!nickname || typeof attempts !== 'number' || typeof time !== 'number') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    if (nickname.length < 2 || nickname.length > 15) {
      return NextResponse.json({ error: 'Nickname must be 2-15 characters' }, { status: 400 });
    }

    if (attempts < 1 || attempts > 6) {
      return NextResponse.json({ error: 'Invalid attempts' }, { status: 400 });
    }

    // Check if KV is configured
    if (!process.env.KV_REST_API_URL) {
      return NextResponse.json({ error: 'Leaderboard not configured' }, { status: 503 });
    }

    const entry: LeaderboardEntry = {
      nickname: nickname.slice(0, 15),
      attempts,
      time: Math.round(time),
      wordLength,
      timestamp: Date.now(),
    };

    const key = getTodayKey(wordLength);

    // Check if this nickname already submitted today
    const existing: LeaderboardEntry[] = await kv.lrange(key, 0, -1) || [];
    const alreadySubmitted = existing.some(e =>
      e.nickname.toLowerCase() === nickname.toLowerCase()
    );

    if (alreadySubmitted) {
      return NextResponse.json({ error: 'Already submitted today', alreadySubmitted: true });
    }

    // Add to leaderboard
    await kv.lpush(key, entry);

    // Set expiry for 48 hours (so yesterday's data is still available briefly)
    await kv.expire(key, 48 * 60 * 60);

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error('Leaderboard POST error:', error);
    return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 });
  }
}
