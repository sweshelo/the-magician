import { CardsCountView } from '@/component/ui/CardsCountView';
import { HighlightBoarder } from '@/component/ui/HighlightBorder';
import { useCardsDialog } from '@/hooks/cards-dialog';
import { useGame } from '@/hooks/game';
import { useSystemContext } from '@/hooks/system/hooks';
import { useDroppable } from '@dnd-kit/core';
import { useCallback } from 'react';
import { BsTrash3Fill } from 'react-icons/bs';
import { GiCardDiscard } from 'react-icons/gi';

export const MyTrash = () => {
  const { self } = useGame();
  const { openCardsDialog } = useCardsDialog();
  const { activeCard } = useSystemContext();

  // メモ化されたイベントハンドラ
  const handleTrashClick = useCallback(() => {
    if (self?.trash) {
      openCardsDialog([...self.trash].reverse(), 'あなたの捨札');
    }
  }, [openCardsDialog, self?.trash]);

  const { setNodeRef, isOver } = useDroppable({
    id: 'trash',
    data: {
      type: 'trash',
      accepts: ['card'],
    },
  });

  return (
    <div ref={setNodeRef} className="relative">
      <CardsCountView count={self.trash.length}>
        <div
          className="flex justify-center items-center cursor-pointer w-full h-full"
          onClick={handleTrashClick}
        >
          {activeCard ? (
            <GiCardDiscard color="yellowgreen" size={40} />
          ) : (
            <BsTrash3Fill color="yellowgreen" size={32} />
          )}
        </div>
      </CardsCountView>
      {isOver && <HighlightBoarder />}
    </div>
  );
};
