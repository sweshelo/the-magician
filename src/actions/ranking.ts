'use server';

import { unstable_cache } from 'next/cache';
import { endOfWeek, previousSunday, startOfWeek, subDays } from 'date-fns';
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

  // カード名ベースで使用回数を合算（同名カードのIDが複数ある場合に対応）
  const nameCounts = new Map<
    string,
    { useCount: number; cardId: string; rarity: string; type: string; cost: number; color: number }
  >();
  for (const [cardId, useCount] of cardCounts) {
    const card = master.get(cardId);
    const name = card?.name ?? cardId;

    if (card?.species?.includes('ウィルス')) continue;

    const existing = nameCounts.get(name);
    if (existing) {
      existing.useCount += useCount;
    } else {
      nameCounts.set(name, {
        useCount,
        cardId,
        rarity: card?.rarity ?? '',
        type: card?.type ?? '',
        cost: card?.cost ?? 0,
        color: card?.color ?? 0,
      });
    }
  }

  // Sort by use count descending
  const sorted = [...nameCounts.entries()].sort((a, b) => b[1].useCount - a[1].useCount);

  // Build ranking
  const ranking: RankingEntry[] = [];
  let rank = 1;

  for (const [name, data] of sorted) {
    ranking.push({ rank, name, ...data });
    rank++;
  }

  // Append implemented cards with 0 usage
  const seenNames = new Set(nameCounts.keys());
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

async function fetchWeightedRanking(): Promise<RankingMasterResponse> {
  const today = new Date();
  const baseDate = previousSunday(today);
  const week1Start = startOfWeek(baseDate, { weekStartsOn: 1 });
  const week1End = endOfWeek(baseDate, { weekStartsOn: 1 });

  const weeks = [
    { weight: 3, start: week1Start, end: week1End },
    { weight: 2, start: subDays(week1Start, 7), end: subDays(week1End, 7) },
    { weight: 1, start: subDays(week1Start, 14), end: subDays(week1End, 14) },
  ];

  // 3週分を並列取得
  const results = await Promise.all(
    weeks.map(w => getRankingMaster({ from: w.start.toISOString(), to: w.end.toISOString() }))
  );

  // カード名ベースで重み付き使用回数を合算（カード情報も保持）
  const weightedCounts = new Map<
    string,
    { useCount: number; cardId: string; rarity: string; type: string; cost: number; color: number }
  >();

  for (let i = 0; i < results.length; i++) {
    const weight = weeks[i].weight;
    for (const entry of results[i].ranking) {
      const existing = weightedCounts.get(entry.name);
      if (existing) {
        existing.useCount += entry.useCount * weight;
      } else {
        weightedCounts.set(entry.name, {
          useCount: entry.useCount * weight,
          cardId: entry.cardId,
          rarity: entry.rarity,
          type: entry.type,
          cost: entry.cost,
          color: entry.color,
        });
      }
    }
  }

  // 重み付き使用回数で降順ソート → RankingEntry[] を構築
  const sorted = [...weightedCounts.entries()].sort((a, b) => b[1].useCount - a[1].useCount);

  const ranking: RankingEntry[] = [];
  let rank = 1;
  for (const [name, data] of sorted) {
    ranking.push({ rank, name, ...data });
    rank++;
  }

  // 使用回数0のカードを末尾に追加
  const implementedIds = await getImplementedCardIds();
  const seenNames = new Set(weightedCounts.keys());
  const zeroUsageEntries: RankingEntry[] = [];
  for (const id of implementedIds) {
    const card = master.get(id);
    if (!card || seenNames.has(card.name) || card.species?.includes('ウィルス')) continue;
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
  zeroUsageEntries.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
  for (const entry of zeroUsageEntries) {
    entry.rank = rank;
    ranking.push(entry);
    rank++;
  }

  const totalMatches = results.reduce((sum, r) => sum + r.totalMatches, 0);

  return { ranking, totalMatches, generatedAt: new Date().toISOString() };
}

export const getWeightedRanking = unstable_cache(fetchWeightedRanking, ['weighted-ranking'], {
  revalidate: 604800,
});
