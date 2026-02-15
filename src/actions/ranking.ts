'use server';

import { unstable_cache } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/server';
import master from '@/submodule/suit/catalog/catalog';
import type { RankingEntry, RankingMasterResponse, RankingOptions } from './ranking.types';
import { getImplementedCardIds } from '@/helper/card';

const PAGE_SIZE = 1000;

async function fetchAllMatches(
  supabase: ReturnType<typeof createAdminClient>,
  options: RankingOptions
) {
  const { from, to } = options;
  const allRows: { player1_deck: unknown; player2_deck: unknown }[] = [];
  let offset = 0;

  while (true) {
    let query = supabase
      .from('matches')
      .select('player1_deck, player2_deck')
      .not('matching_mode', 'is', null)
      .range(offset, offset + PAGE_SIZE - 1);

    if (from) {
      query = query.gte('started_at', from);
    }
    if (to) {
      query = query.lte('started_at', to);
    }

    const { data, error } = await query;
    if (error) {
      console.error('マッチデータ取得エラー:', error);
      return null;
    }

    allRows.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return allRows;
}

async function fetchRankingMaster(options: RankingOptions = {}): Promise<RankingMasterResponse> {
  const { deduplicate = false } = options;
  const supabase = createAdminClient();

  const [matches, implementedIds] = await Promise.all([
    fetchAllMatches(supabase, options),
    getImplementedCardIds(),
  ]);

  if (!matches) {
    return { ranking: [], totalMatches: 0, generatedAt: new Date().toISOString() };
  }

  const totalMatches = matches.length;

  // JS-side aggregation
  const cardCounts = new Map<string, number>();
  for (const match of matches) {
    for (const deck of [match.player1_deck, match.player2_deck]) {
      if (!Array.isArray(deck)) continue;
      const seen = deduplicate ? new Set<string>() : null;
      for (const cardId of deck) {
        if (typeof cardId !== 'string') continue;
        if (seen && seen.has(cardId)) continue;
        seen?.add(cardId);
        cardCounts.set(cardId, (cardCounts.get(cardId) ?? 0) + 1);
      }
    }
  }

  // Sort by use count descending
  const sorted = [...cardCounts.entries()].sort((a, b) => b[1] - a[1]);

  // Build ranking, deduplicating by card name and excluding viruses
  const seenNames = new Set<string>();
  const ranking: RankingEntry[] = [];
  let rank = 1;

  for (const [cardId, useCount] of sorted) {
    const card = master.get(cardId);
    const name = card?.name ?? cardId;

    if (seenNames.has(name) || card?.species?.includes('ウィルス')) continue;
    seenNames.add(name);

    ranking.push({
      rank,
      cardId,
      name,
      useCount,
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
    if (seenNames.has(card.name) || card.species?.includes('ウィルス')) continue;
    seenNames.add(card.name);

    zeroUsageEntries.push({
      rank: 0,
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

export async function getRankingMaster(options: RankingOptions = {}) {
  const normalizedFrom = options.from?.split('T')[0] ?? '';
  const normalizedTo = options.to?.split('T')[0] ?? '';
  const cacheKey = [
    'ranking-master',
    String(options.deduplicate ?? false),
    normalizedFrom,
    normalizedTo,
  ];

  return unstable_cache(() => fetchRankingMaster(options), cacheKey, { revalidate: 604800 })();
}
