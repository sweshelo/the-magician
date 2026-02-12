export const originality = (cards: string[], opMap: Record<string, number>): number => {
  return cards.reduce((sum, cardId) => (opMap[cardId] ?? 0) + sum, 0);
};
