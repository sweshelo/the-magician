'use server';

import { unstable_cache } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/server';
import master from '@/submodule/suit/catalog/catalog';
import type { RankingEntry, RankingMasterResponse } from './ranking.types';
import { getImplementedCardIds } from '@/helper/card';

async function fetchRankingMaster(): Promise<RankingMasterResponse> {
  const supabase = createAdminClient();

  const [rankingResult, matchCountResult, implementedIds] = await Promise.all([
    supabase.rpc('get_card_usage_ranking'),
    supabase.from('matches').select('*', { count: 'exact', head: true }),
    getImplementedCardIds(),
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

  // Build ranking from usage data, deduplicating by card name
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

  // Append implemented cards with 0 usage
  const zeroUsageEntries: RankingEntry[] = [];
  for (const id of implementedIds) {
    const card = master.get(id);
    if (!card) continue;
    if (seenNames.has(card.name)) continue;
    seenNames.add(card.name);

    zeroUsageEntries.push({
      rank: 0, // assigned below
      cardId: id,
      name: card.name,
      useCount: 0,
      rarity: card.rarity,
      type: card.type,
      cost: card.cost,
      color: card.color,
    });
  }

  // Sort zero-usage cards alphabetically by name for stable ordering
  zeroUsageEntries.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
  for (const entry of zeroUsageEntries) {
    entry.rank = rank;
    ranking.push(entry);
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
