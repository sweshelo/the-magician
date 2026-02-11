'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { checkAdminAccess } from '@/actions/admin';
import type { Profile, Match } from '@/type/supabase';

// ===== 型定義 =====
interface Deck {
  cards: string[];
  jokers: string[];
}

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

export type MatchWithOpponent = {
  id: string;
  started_at: string | null;
  ended_at: string | null;
  total_rounds: number | null;
  total_turns: number | null;
  matching_mode: string | null;
  end_reason: string | null;
  opponent: {
    id: string;
    name: string;
    deck: Deck;
  };
  me: {
    deck: Deck;
    is_first_player: boolean;
  };
  result: 'win' | 'lose' | 'unknown';
};

export type MatchListResponse = {
  matches: MatchWithOpponent[];
  total: number;
};

export type PublicProfileResponse = {
  userName: string;
  stats: ProfileStats;
} | null;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

function determineResult(match: Match, userId: string): 'win' | 'lose' | 'unknown' {
  if (match.winner_index === null) return 'unknown';
  return match.winner_index === getPlayerIndex(match, userId) ? 'win' : 'lose';
}

function jsonToDeck(deck: unknown): string[] | null {
  if (Array.isArray(deck)) return deck as string[];
  return null;
}

function enrichMatchesWithOpponents(matches: Match[], userId: string): MatchWithOpponent[] {
  return matches.map(match => {
    const isPlayer1 = match.player1_id === userId;
    const playerIndex = isPlayer1 ? 0 : 1;
    return {
      id: match.id,
      started_at: match.started_at,
      ended_at: match.ended_at,
      total_rounds: match.total_rounds,
      total_turns: match.total_turns,
      matching_mode: match.matching_mode,
      end_reason: match.end_reason,
      opponent: {
        id: (isPlayer1 ? match.player2_id : match.player1_id) ?? '',
        name: isPlayer1 ? match.player2_name : match.player1_name,
        deck: {
          cards: jsonToDeck(isPlayer1 ? match.player2_deck : match.player1_deck) ?? [],
          jokers: jsonToDeck(isPlayer1 ? match.player2_jokers : match.player1_jokers) ?? [],
        },
      },
      me: {
        deck: {
          cards: jsonToDeck(isPlayer1 ? match.player1_deck : match.player2_deck) ?? [],
          jokers: jsonToDeck(isPlayer1 ? match.player1_jokers : match.player2_jokers) ?? [],
        },
        is_first_player: match.first_player_index === playerIndex,
      },
      result: determineResult(match, userId),
    };
  });
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

  const enrichedMatches = enrichMatchesWithOpponents(data ?? [], user.id);

  return {
    matches: enrichedMatches,
    total: count ?? 0,
  };
}

/**
 * 管理者用: 任意ユーザーのプロフィールと戦績を取得
 */
export async function getUserProfile(userId: string): Promise<ProfileResponse> {
  if (!UUID_RE.test(userId)) return null;

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
  if (!UUID_RE.test(userId)) return { matches: [], total: 0 };

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

  const enrichedMatches = enrichMatchesWithOpponents(data ?? [], userId);

  return {
    matches: enrichedMatches,
    total: count ?? 0,
  };
}

// ===== 公開プロフィール =====

/** ユーザーIDからマッチ履歴内のプレイヤー名を取得 */
function resolveUserName(matches: Match[], userId: string): string {
  for (const match of matches) {
    if (match.player1_id === userId) return match.player1_name;
    if (match.player2_id === userId) return match.player2_name;
  }
  return '不明';
}

/**
 * 公開プロフィール: 任意ユーザーのプロフィール情報と戦績サマリーを取得
 * RLS により、現在のログインユーザーが参加した試合のみが返される
 */
export async function getPublicProfile(userId: string): Promise<PublicProfileResponse> {
  if (!UUID_RE.test(userId)) return null;

  if (process.env.AUTH_SKIP === 'true') {
    return {
      userName: 'テストユーザー',
      stats: { totalMatches: 0, wins: 0, losses: 0, winRate: 0 },
    };
  }

  const supabase = await createClient();

  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .or(`player1_id.eq.${userId},player2_id.eq.${userId}`);

  if (!matches || matches.length === 0) return null;

  const userName = resolveUserName(matches, userId);
  const stats = computeStats(matches, userId);

  return { userName, stats };
}

/**
 * 公開プロフィール: 任意ユーザーの対戦履歴を取得
 * RLS により、現在のログインユーザーが参加した試合のみが返される
 */
export async function getProfileMatches(
  userId: string,
  options?: { page?: number; limit?: number }
): Promise<MatchListResponse> {
  if (!UUID_RE.test(userId)) return { matches: [], total: 0 };

  if (process.env.AUTH_SKIP === 'true') {
    return { matches: [], total: 0 };
  }

  const supabase = await createClient();

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 20;
  const offset = (page - 1) * limit;

  const { data, count } = await supabase
    .from('matches')
    .select('*', { count: 'exact' })
    .or(`player1_id.eq.${userId},player2_id.eq.${userId}`)
    .order('started_at', { ascending: false })
    .range(offset, offset + limit - 1);

  const profileMatches = enrichMatchesWithOpponents(data ?? [], userId);

  return {
    matches: profileMatches,
    total: count ?? 0,
  };
}
