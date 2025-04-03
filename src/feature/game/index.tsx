'use client';

import { CardDetailWindow } from '@/component/ui/CardDetailWindow';
import { CardEffectDialog } from '@/component/ui/CardEffectDialog';
import { CPView } from '@/component/ui/CPView';
import { DebugDialog } from '@/component/ui/DebugDialog';
import { LifeView } from '@/component/ui/LifeView';
import { colorTable } from '@/helper/color';
import { useGame } from '@/hooks/game';
import { MyArea } from '../MyArea';
import { DndContext } from '@dnd-kit/core';
import { useGameComponentHook } from './hook';
import { CardsDialog } from '../CardsDialog';
import { CardsCountView } from '@/component/ui/CardsCountView';
import { GiCardDraw } from 'react-icons/gi';
import { BsTrash3Fill } from 'react-icons/bs';
import { useCardsDialog } from '@/hooks/cards-dialog';
import { Field } from '../Field';
import { MyFieldWrapper } from '../MyFieldWrapper';

interface RoomProps {
  id: string
}

export const Game = ({ id }: RoomProps) => {
  useGameComponentHook({ id })
  const { opponent, self } = useGame()
  const { openCardsDialog } = useCardsDialog();

  return (
    <DndContext>
      <div className={`flex h-screen ${colorTable.ui.background} ${colorTable.ui.text.primary} relative`}>
        {/* カード詳細ウィンドウ */}
        <CardDetailWindow />

        {/* デバッグダイアログ */}
        <DebugDialog />

        {/* カード効果表示ダイアログ */}
        <CardEffectDialog />

        {/* メインゲームコンテナ */}
        <div className="flex flex-col w-full h-full p-4">
          {/* 対戦相手エリア */}
          <div className={`flex-col p-4 border-b ${colorTable.ui.border}`}>
            {/* 対戦相手情報 */}
            <div className={`flex justify-between p-2 ${colorTable.ui.playerInfoBackground} rounded-lg mb-4`}>
              <div className="player-identity">
                <div className="font-bold text-lg">{opponent?.status.name ?? '対戦相手 検索中…'}</div>
                <div className={`text-sm ${colorTable.ui.text.secondary}`}>オンライン</div>
              </div>
              {/* 対戦相手の手札エリア */}
              <div className="flex justify-center gap-2">
                {/* 対戦相手の手札は裏向きに表示 */}
                {opponent?.hand?.map((i) => (
                  <div
                    key={`opponent-card-${i.id}`}
                    className={`w-8 h-12 ${colorTable.ui.opponentCardBackground} rounded flex justify-center items-center shadow-md ${colorTable.symbols.mana} text-2xl`}
                  />
                ))}
              </div>
              <div className="flex gap-4">
                {opponent?.deck && (
                  <CardsCountView count={opponent.deck.length}>
                    <div className="flex justify-center items-center cursor-pointer w-full h-full" onClick={() => {
                      openCardsDialog(opponent.deck, "対戦相手のデッキ");
                    }}>
                      {
                        <GiCardDraw color="cyan" size={40} />
                      }
                    </div>
                  </CardsCountView>
                )}
                {opponent?.trash && (
                  <CardsCountView count={opponent.trash.length}>
                    <div className="flex justify-center items-center cursor-pointer w-full h-full" onClick={() => {
                      openCardsDialog(opponent.trash, "対戦相手の捨札");
                    }}>
                      {
                        <BsTrash3Fill color="yellowgreen" size={32} />
                      }
                    </div>
                  </CardsCountView>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {opponent?.status.life !== undefined && (
                  <LifeView current={opponent.status.life.current} max={opponent.status.life.max} />
                )}
                {opponent?.status.cp !== undefined && (
                  <CPView current={opponent.status.cp.current} max={opponent.status.cp.max} />
                )}
              </div>
            </div>
          </div>

          {/* フィールドエリア */}
          <div className={`flex flex-col p-x-6 ${colorTable.ui.fieldBackground} rounded-lg my-4`}>
            {/* 対戦相手のフィールド */}
            <Field units={opponent.field} />
            <div className={`border-b border-dashed ${colorTable.ui.borderDashed} h-1`} />
            {/* 自分のフィールド */}
            <MyFieldWrapper>
              <Field units={self.field} />
            </MyFieldWrapper>
          </div>

          {/* 自分のエリア */}
          <MyArea />

          {/* カード一覧 */}
          <CardsDialog />

        </div>
      </div>
    </DndContext>
  );
};
