'use server';

import { cache } from 'react';
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
 * RLSにより、公開デッキは誰でも・非公開デッキはオーナーのみ取得可能
 * React.cache によりリクエスト内で重複呼び出しがデデュプされる
 */
export const getDeck = cache(async (deckId: string): Promise<DeckDetailResponse> => {
  const supabase = await createClient();

  const { data: deck, error } = await supabase
    .from('decks')
    .select('id, title, cards, jokers, is_public, user_id')
    .eq('id', deckId)
    .single();

  if (error || !deck) return null;

  // オーナーの display_name を取得（profiles は RLS で制限される可能性があるため adminClient を使用）
  const adminClient = createAdminClient();
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
});

/**
 * デッキの公開状態を設定
 * 認証済みユーザーのみ、自分のデッキのみ操作可能（RLSで制御）
 */
export async function setDeckPublic(
  deckId: string,
  isPublic: boolean
): Promise<{ is_public: boolean } | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  // RLSにより自分のデッキのみ更新可能
  const { data: updated, error: updateError } = await supabase
    .from('decks')
    .update({ is_public: isPublic })
    .eq('id', deckId)
    .select('is_public')
    .single();

  if (updateError || !updated) return null;

  return { is_public: updated.is_public };
}
