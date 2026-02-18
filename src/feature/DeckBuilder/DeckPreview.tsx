import { RichButton } from '@/component/ui/RichButton';
import { DeckCardGrid } from '@/component/ui/DeckCardGrid';
import { ReactNode } from 'react';

interface DeckPreviewProps {
  deck: {
    cards: string[];
    jokers?: string[];
  };
  onClose: () => void;
  children?: ReactNode;
}

export const DeckPreview = ({ deck, onClose, children }: DeckPreviewProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95">
      <div className="flex flex-col items-center">
        <DeckCardGrid cards={deck.cards} jokers={deck.jokers} />
        <div className="mt-6 flex justify-center gap-2">
          <RichButton onClick={onClose}>閉じる</RichButton>
          {children}
        </div>
      </div>
    </div>
  );
};
