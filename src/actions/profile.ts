'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { checkAdminAccess } from '@/actions/admin';
import type { Profile, Match } from '@/type/supabase';

// ===== 型定義 =====

export type ProfileStats = {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
};

export type ProfileResponse = {
  profile: Profile;
  stats: ProfileStats;
} | null;

export type MatchWithOpponent = Match & {
  opponent: Profile | null;
  result: 'win' | 'lose' | 'draw';
  myDeck: string[] | null;
  opponentDeck: string[] | null;
};

export type MatchListResponse = {
  matches: MatchWithOpponent[];
  total: number;
};

// ===== ヘルパー =====

/** ユーザーがplayer1かplayer2かを判定し、そのインデックス(0 or 1)を返す */
function getPlayerIndex(match: Match, userId: string): number {
  return match.player1_id === userId ? 0 : 1;
}

function computeStats(matches: Match[], userId: string): ProfileStats {
  const totalMatches = matches.length;
  const wins = matches.filter(m => m.winner_index === getPlayerIndex(m, userId)).length;
  const losses = matches.filter(
    m => m.winner_index !== null && m.winner_index !== getPlayerIndex(m, userId)
  ).length;
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;
  return { totalMatches, wins, losses, winRate };
}

function determineResult(match: Match, userId: string): 'win' | 'lose' | 'draw' {
  if (match.winner_index === null) return 'draw';
  return match.winner_index === getPlayerIndex(match, userId) ? 'win' : 'lose';
}

function jsonToDeck(deck: unknown): string[] | null {
  if (Array.isArray(deck)) return deck as string[];
  return null;
}

function getMyDeck(match: Match, userId: string): string[] | null {
  if (match.player1_id === userId) return jsonToDeck(match.player1_deck);
  return jsonToDeck(match.player2_deck);
}

function getOpponentDeck(match: Match, userId: string): string[] | null {
  if (match.player1_id === userId) return jsonToDeck(match.player2_deck);
  return jsonToDeck(match.player1_deck);
}

function getOpponentId(match: Match, userId: string): string | null {
  if (match.player1_id === userId) return match.player2_id;
  return match.player1_id;
}

async function enrichMatchesWithOpponents(
  matches: Match[],
  userId: string
): Promise<MatchWithOpponent[]> {
  // 対戦相手IDを収集
  const opponentIds = [
    ...new Set(
      matches.map(m => getOpponentId(m, userId)).filter((id): id is string => id !== null)
    ),
  ];

  // 対戦相手のプロフィールをadminClientでバッチ取得（profilesのRLSは自分のみSELECT可のため）
  let opponentMap = new Map<string, Profile>();
  if (opponentIds.length > 0) {
    const adminClient = createAdminClient();
    const { data: opponents } = await adminClient
      .from('profiles')
      .select('*')
      .in('id', opponentIds);

    if (opponents) {
      opponentMap = new Map(opponents.map(p => [p.id, p]));
    }
  }

  return matches.map(match => ({
    ...match,
    opponent: opponentMap.get(getOpponentId(match, userId) ?? '') ?? null,
    result: determineResult(match, userId),
    myDeck: getMyDeck(match, userId),
    opponentDeck: getOpponentDeck(match, userId),
  }));
}

// ===== Server Actions =====

/**
 * 自分のプロフィールと戦績サマリーを取得
 */
export async function getMyProfile(): Promise<ProfileResponse> {
  if (process.env.AUTH_SKIP === 'true') {
    return {
      profile: {
        id: 'mock-user',
        discord_id: '000000000000000000',
        discord_username: 'devuser',
        display_name: '開発ユーザー',
        avatar_url: null,
        is_admin: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      stats: { totalMatches: 0, wins: 0, losses: 0, winRate: 0 },
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  if (!profile) return null;

  // 戦績を集計（明示的なフィルタ + RLSで自分の対戦のみ取得）
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`);

  const stats = computeStats(matches ?? [], user.id);

  return { profile, stats };
}

/**
 * 自分の対戦履歴を取得
 */
export async function getMyMatches(options?: {
  page?: number;
  limit?: number;
}): Promise<MatchListResponse> {
  if (process.env.AUTH_SKIP === 'true') {
    return { matches: [], total: 0 };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { matches: [], total: 0 };
  }

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 20;
  const offset = (page - 1) * limit;

  const { data, count } = await supabase
    .from('matches')
    .select('*', { count: 'exact' })
    .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`)
    .order('started_at', { ascending: false })
    .range(offset, offset + limit - 1);

  const enrichedMatches = await enrichMatchesWithOpponents(data ?? [], user.id);

  return {
    matches: enrichedMatches,
    total: count ?? 0,
  };
}

/**
 * 管理者用: 任意ユーザーのプロフィールと戦績を取得
 */
export async function getUserProfile(userId: string): Promise<ProfileResponse> {
  if (process.env.AUTH_SKIP === 'true') {
    return {
      profile: {
        id: userId,
        discord_id: '000000000000000000',
        discord_username: 'testuser',
        display_name: 'テストユーザー',
        avatar_url: null,
        is_admin: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      stats: { totalMatches: 0, wins: 0, losses: 0, winRate: 0 },
    };
  }

  const adminCheck = await checkAdminAccess();
  if ('error' in adminCheck) return null;

  const adminClient = createAdminClient();

  const { data: profile } = await adminClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!profile) return null;

  // 全対戦を取得して戦績集計
  const { data: matches } = await adminClient
    .from('matches')
    .select('*')
    .or(`player1_id.eq.${userId},player2_id.eq.${userId}`);

  const stats = computeStats(matches ?? [], userId);

  return { profile, stats };
}

/**
 * 管理者用: 任意ユーザーの対戦履歴を取得
 */
export async function getUserMatches(
  userId: string,
  options?: { page?: number; limit?: number }
): Promise<MatchListResponse> {
  if (process.env.AUTH_SKIP === 'true') {
    return { matches: [], total: 0 };
  }

  const adminCheck = await checkAdminAccess();
  if ('error' in adminCheck) {
    return { matches: [], total: 0 };
  }

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 20;
  const offset = (page - 1) * limit;

  const adminClient = createAdminClient();

  const { data, count } = await adminClient
    .from('matches')
    .select('*', { count: 'exact' })
    .or(`player1_id.eq.${userId},player2_id.eq.${userId}`)
    .order('started_at', { ascending: false })
    .range(offset, offset + limit - 1);

  const enrichedMatches = await enrichMatchesWithOpponents(data ?? [], userId);

  return {
    matches: enrichedMatches,
    total: count ?? 0,
  };
}
