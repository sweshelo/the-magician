import master from '@/submodule/suit/catalog/catalog';

export const originality = (cards: string[]): number => {
  return cards.reduce((sum, cardId) => (master.get(cardId)?.originality ?? 0) + sum, 0);
};
