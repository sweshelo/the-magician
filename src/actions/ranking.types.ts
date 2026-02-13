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

export type OriginalityTier = {
  label: string;
  points: number;
  startRank: number;
  endRank: number | null;
};

export const ORIGINALITY_TIERS: OriginalityTier[] = [
  { label: 'Originality 0pt.', points: 0, startRank: 1, endRank: 100 },
  { label: 'Originality 1pt.', points: 1, startRank: 101, endRank: 200 },
  { label: 'Originality 2pt.', points: 2, startRank: 201, endRank: 300 },
  { label: 'Originality 4pt.', points: 4, startRank: 301, endRank: 400 },
  { label: 'Originality 8pt.', points: 8, startRank: 401, endRank: null },
];

export type RankingMasterResponse = {
  ranking: RankingEntry[];
  totalMatches: number;
  generatedAt: string;
};
