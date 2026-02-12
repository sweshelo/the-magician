'use server';

import { unstable_cache } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/server';
import master from '@/submodule/suit/catalog/catalog';

export type RankingEntry = {
  rank: number;
  cardId: string;
  name: string;
  useCount: number;
  rarity: string;
  type: string;
  cost: number;
  color: number;
};

export type RankingMasterResponse = {
  ranking: RankingEntry[];
  totalMatches: number;
  generatedAt: string;
};

async function fetchRankingMaster(): Promise<RankingMasterResponse> {
  const supabase = createAdminClient();

  const [rankingResult, matchCountResult] = await Promise.all([
    supabase.rpc('get_card_usage_ranking'),
    supabase.from('matches').select('*', { count: 'exact', head: true }),
  ]);

  if (rankingResult.error) {
    console.error('カード使用ランキング取得エラー:', rankingResult.error);
    return { ranking: [], totalMatches: 0, generatedAt: new Date().toISOString() };
  }

  if (matchCountResult.error) {
    console.error('マッチ数取得エラー:', matchCountResult.error);
  }

  const rawRanking = (rankingResult.data ?? []) as { card_id: string; use_count: number }[];
  const totalMatches = matchCountResult.count ?? 0;

  const seenNames = new Set<string>();
  const ranking: RankingEntry[] = [];
  let rank = 1;

  for (const item of rawRanking) {
    const card = master.get(item.card_id);
    const name = card?.name ?? item.card_id;

    if (seenNames.has(name)) continue;
    seenNames.add(name);

    ranking.push({
      rank,
      cardId: item.card_id,
      name,
      useCount: item.use_count,
      rarity: card?.rarity ?? '',
      type: card?.type ?? '',
      cost: card?.cost ?? 0,
      color: card?.color ?? 0,
    });
    rank++;
  }

  return {
    ranking,
    totalMatches,
    generatedAt: new Date().toISOString(),
  };
}

export const getRankingMaster = unstable_cache(fetchRankingMaster, ['ranking-master'], {
  revalidate: 604800,
});
