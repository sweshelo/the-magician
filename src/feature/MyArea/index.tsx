import { CPView } from '@/component/ui/CPView';
import { CardsCountView } from '@/component/ui/CardsCountView';
import { LifeView } from '@/component/ui/LifeView';
import { colorTable } from '@/helper/color';
import { HandArea } from '../Hand';
import { GiCardDraw } from 'react-icons/gi';
import { useCardsDialog } from '@/hooks/cards-dialog';
import { MyTriggerZone } from '../MyTriggerZone';
import { useMyArea } from './hooks';
import { useCallback } from 'react';
import { MyTrash } from '../MyTrash';
import { LocalStorageHelper } from '@/service/local-storage';
import { ICard } from '@/submodule/suit/types';
import { useGameStore } from '@/hooks/game';

export const MyArea = () => {
  const { openCardsDialog } = useCardsDialog();
  const playerId = LocalStorageHelper.playerId();

  const deck = (useGameStore.getState().players?.[playerId]?.deck ?? []) as ICard[];
  const self = useGameStore.getState().players?.[playerId];

  const handleDeckClick = useCallback(() => {
    openCardsDialog(state => (state.players?.[playerId]?.deck ?? []) as ICard[], 'あなたのデッキ');
  }, [openCardsDialog, playerId]);
  useMyArea();

  return (
    <div className="flex-col p-4 min-h-[250px]">
      {/* 自分の情報 */}
      <div
        className={`flex justify-between items-center p-2 ${colorTable.ui.playerInfoBackground} rounded-lg mb-4`}
      >
        <div className="player-identity">
          <div className="font-bold text-lg">{self?.name || ''}</div>
          <div className={`text-sm ${colorTable.ui.text.secondary}`}>あなたのターン</div>
        </div>

        <div className="flex gap-4">
          {deck && (
            <CardsCountView count={deck.length}>
              <div
                className="flex justify-center items-center cursor-pointer w-full h-full"
                onClick={handleDeckClick}
              >
                {<GiCardDraw color="cyan" size={40} />}
              </div>
            </CardsCountView>
          )}
          <MyTrash />
        </div>

        <MyTriggerZone />

        <div className="flex flex-col gap-2">
          {self?.life && <LifeView current={self.life.current} max={self.life.max} />}
          {self?.cp && <CPView current={self.cp.current} max={self.cp.max} />}
        </div>
      </div>

      {/* 自分の手札エリア */}
      <div className="flex justify-center">
        <HandArea playerId={playerId} />
        {/*
        <div className="flex gap-2">
          <HandView
            key={`hand-card-jk1`}
            card={{ id: "jk1", catalogId: "", lv: 1 }}
          />
          <HandView
            key={`hand-card-jk2`}
            card={{ id: "jk2", catalogId: "", lv: 1 }}
          />
        </div>
        */}
      </div>
    </div>
  );
};
