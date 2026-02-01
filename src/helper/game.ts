import master from '@/submodule/suit/catalog/catalog';
import { JOKER_GAUGE_AMOUNT } from '@/submodule/suit/constant/joker';
import { ICard } from '@/submodule/suit/types';
import type { IJoker } from '@/submodule/suit/types/game/joker';

export const getJokerGaugePercentage = (joker: IJoker): number | undefined => {
  const catalog = master.get(joker.catalogId);
  if (!catalog?.gauge) return undefined;
  return JOKER_GAUGE_AMOUNT[catalog.gauge];
};

export const isMitigated = (card: ICard, trigger: ICard[]) => {
  const target = master.get(card.catalogId);
  const triggerColor = trigger
    .map(c => {
      const catalog = master.get(c.catalogId);
      return catalog?.type === 'advanced_unit' || catalog?.type === 'unit'
        ? catalog.color
        : undefined;
    })
    .filter(color => typeof color === 'number');

  return (target?.type === 'advanced_unit' || target?.type === 'unit') &&
    target?.color &&
    triggerColor.includes(target?.color)
    ? true
    : false;
};
