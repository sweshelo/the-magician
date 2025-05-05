import { CardsDialogView } from '@/component/ui/CardsDialog';
import { ProgressConfirmButton } from '@/component/ui/ProgressConfirmButton';
import { ICard } from '@/submodule/suit/types';

interface DeckPreviewProps {
  cards: ICard[];
  onClose: () => void;
}

export const DeckPreview = ({ cards, onClose }: DeckPreviewProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95">
      <div className="flex flex-col items-center">
        <CardsDialogView cards={cards} isAnimating={true} height={688} />
        <div className="mt-6 flex justify-center">
          <ProgressConfirmButton buttonText="閉じる" onConfirm={onClose} />
        </div>
      </div>
    </div>
  );
};
