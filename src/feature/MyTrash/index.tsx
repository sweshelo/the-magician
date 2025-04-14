import { CardsCountView } from '@/component/ui/CardsCountView';
import { HighlightBoarder } from '@/component/ui/HighlightBorder';
import { useCardsDialog } from '@/hooks/cards-dialog';
import { useGameStore } from '@/hooks/game';
import { ICard } from '@/submodule/suit/types';
import { useSystemContext } from '@/hooks/system/hooks';
import { LocalStorageHelper } from '@/service/local-storage';
import { useDroppable } from '@dnd-kit/core';
import { useCallback, useMemo } from 'react';
import { BsTrash3Fill } from 'react-icons/bs';
import { GiCardDiscard } from 'react-icons/gi';

export const MyTrash = () => {
  const { openCardsDialog } = useCardsDialog();
  const { activeCard } = useSystemContext();
  const playerId = LocalStorageHelper.playerId();
  const trash = useMemo(
    () => (useGameStore.getState().players?.[playerId]?.trash ?? []) as ICard[],
    [playerId]
  );

  // メモ化されたイベントハンドラ
  const handleTrashClick = useCallback(() => {
    if (trash) {
      openCardsDialog([...trash].reverse(), 'あなたの捨札');
    }
  }, [openCardsDialog, trash]);

  const { setNodeRef, isOver } = useDroppable({
    id: 'trash',
    data: {
      type: 'trash',
      accepts: ['card'],
    },
  });

  return (
    <div ref={setNodeRef} className="relative">
      <CardsCountView count={trash.length}>
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
