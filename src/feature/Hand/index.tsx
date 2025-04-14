import { HandView } from '@/component/ui/HandView';
import { useGameStore } from '@/hooks/game';
import { useMemo } from 'react';
import { ICard } from '@/submodule/suit/types';

interface HandAreaProps {
  playerId: string;
}

export const HandArea = ({ playerId }: HandAreaProps) => {
  const rule = useGameStore.getState().rule;
  const hand = (useGameStore.getState().players?.[playerId]?.hand ?? []) as ICard[];

  // Calculate the width needed for all placeholder slots
  const containerWidth = useMemo(() => {
    const cardWidth = 116;
    const gapWidth = 8;
    const totalWidth = cardWidth * rule.player.max.hand + gapWidth * (rule.player.max.hand - 1);
    return totalWidth;
  }, [rule.player.max.hand]);

  return (
    <div className="min-h-[180px] relative" style={{ minWidth: `${containerWidth}px` }}>
      {/* Placeholders - always display for all slots - left aligned */}
      <div className="flex justify-start gap-2 absolute inset-0 pointer-events-none">
        {[...Array(rule.player.max.hand)].map((_, index) => (
          <div
            className="w-28 h-39 border-1 border-white border-opacity-20 rounded-sm bg-gray-800 bg-opacity-20"
            key={`placeholder-${index}`}
          />
        ))}
      </div>

      {/* Actual cards - left aligned */}
      <div className="flex justify-start gap-2 relative">
        {hand.map(card => (
          <HandView key={`hand-card-${card.id}`} card={card} />
        ))}
      </div>
    </div>
  );
};
