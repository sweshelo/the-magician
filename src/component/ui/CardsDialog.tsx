import { ICard } from '@/submodule/suit/types';
import { CardView } from './CardView';

interface CardsDialogViewProps {
  cards: ICard[];
  isAnimating?: boolean;
  handleCardClick?: (card: ICard) => void;
  selection?: ICard['id'][];
  height?: number;
}

export const CardsDialogView = ({
  cards,
  isAnimating,
  handleCardClick,
  selection,
  height = 520,
}: CardsDialogViewProps) => {
  return (
    <div
      className={`bg-slate-800/35 w-full p-4 overflow-auto h-[${height}] border-y-3 border-white p-3`}
      style={{
        opacity: isAnimating ? 1 : 0,
        transition: 'opacity 100ms ease-in-out',
      }}
    >
      {/* Center container */}
      <div className="flex justify-center">
        {/* Card container with max-width for 10 cards, left-aligned */}
        <div className="flex flex-wrap justify-start gap-2 w-[calc(15*112px+9*8px)]">
          {cards?.map(card => (
            <CardView
              card={card}
              key={card.id}
              onClick={() => handleCardClick?.(card)}
              isHighlighting={selection?.includes(card.id)}
              isSelecting={selection?.includes(card.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
