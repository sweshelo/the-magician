'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';

export type DeckDetailResponse = {
  id: string;
  title: string;
  cards: string[];
  jokers: string[];
  is_public: boolean;
  owner: { id: string; displayName: string };
} | null;

/**
 * デッキの詳細を取得
 * - 公開デッキは誰でも取得可能
 * - 非公開デッキはオーナーのみ取得可能
 */
export async function getDeck(deckId: string): Promise<DeckDetailResponse> {
  const adminClient = createAdminClient();

  // まずデッキ本体を取得（RLSバイパス）
  const { data: deck, error } = await adminClient
    .from('decks')
    .select('*')
    .eq('id', deckId)
    .single();

  if (error || !deck) return null;

  // 非公開デッキの場合、オーナーかどうかチェック
  if (!deck.is_public) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== deck.user_id) return null;
  }

  // オーナーの display_name を取得
  const { data: profile } = await adminClient
    .from('profiles')
    .select('display_name, discord_username')
    .eq('id', deck.user_id)
    .single();

  return {
    id: deck.id,
    title: deck.title,
    cards: deck.cards,
    jokers: deck.jokers,
    is_public: deck.is_public,
    owner: {
      id: deck.user_id,
      displayName: profile?.display_name ?? profile?.discord_username ?? '不明',
    },
  };
}

/**
 * デッキの公開状態をトグル
 * 認証済みユーザーのみ、自分のデッキのみ操作可能
 */
export async function toggleDeckPublic(deckId: string): Promise<{ is_public: boolean } | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  const adminClient = createAdminClient();

  // 現在の状態を取得（user_id チェック含む）
  const { data: deck, error: fetchError } = await adminClient
    .from('decks')
    .select('is_public')
    .eq('id', deckId)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !deck) return null;

  // 反転して更新
  const newValue = !deck.is_public;
  const { error: updateError } = await adminClient
    .from('decks')
    .update({ is_public: newValue })
    .eq('id', deckId)
    .eq('user_id', user.id);

  if (updateError) return null;

  return { is_public: newValue };
}
