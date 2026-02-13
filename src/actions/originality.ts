'use server';

import { unstable_cache } from 'next/cache';
import { getRankingMaster } from './ranking';
import { ORIGINALITY_TIERS } from './ranking.types';
import master from '@/submodule/suit/catalog/catalog';

function getPointsForRank(rank: number): number {
  for (const tier of ORIGINALITY_TIERS) {
    if (rank >= tier.startRank && (tier.endRank === null || rank <= tier.endRank)) {
      return tier.points;
    }
  }
  // Default to highest tier for unranked
  return ORIGINALITY_TIERS[ORIGINALITY_TIERS.length - 1].points;
}

async function fetchOriginalityMap(): Promise<Record<string, number>> {
  const { ranking } = await getRankingMaster();

  // Build card name → OP points from ranking
  const nameToPoints = new Map<string, number>();
  for (const entry of ranking) {
    if (!nameToPoints.has(entry.name)) {
      nameToPoints.set(entry.name, getPointsForRank(entry.rank));
    }
  }

  // Map all catalog card IDs to OP points via card name
  const opMap: Record<string, number> = {};
  const highestPoints = ORIGINALITY_TIERS[ORIGINALITY_TIERS.length - 1].points;

  master.forEach((catalog, cardId) => {
    opMap[cardId] = nameToPoints.get(catalog.name) ?? highestPoints;
  });

  return opMap;
}

export const getOriginalityMap = unstable_cache(fetchOriginalityMap, ['originality-map'], {
  revalidate: 604800,
});
