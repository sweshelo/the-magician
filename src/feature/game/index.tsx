'use client';

import { CardDetailWindow } from '@/component/ui/CardDetailWindow';
import { CardEffectDialog } from '@/component/ui/CardEffectDialog';
import { CardUsageEffect } from '@/component/ui/CardUsageEffect';
import { CPView } from '@/component/ui/CPView';
import { DebugDialog } from '@/component/ui/DebugDialog';
import { InterceptSelectionOverlay } from '@/component/ui/InterceptSelectionOverlay';
import { LifeView } from '@/component/ui/LifeView';
import { colorTable } from '@/helper/color';
import { useRule, usePlayers, usePlayer } from '@/hooks/game/hooks';
import { MyArea } from '../MyArea';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  CollisionDetection,
  rectIntersection,
  ClientRect,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useGameComponentHook } from './hook';
import { CardsDialog } from '../CardsDialog';
import { CardsCountView } from '@/component/ui/CardsCountView';
import { GiCardDraw } from 'react-icons/gi';
import { BsTrash3Fill } from 'react-icons/bs';
import { useCardsDialog } from '@/hooks/cards-dialog';
import { useSystemContext } from '@/hooks/system/hooks';
import { Field } from '../Field';
import { MyFieldWrapper } from '../MyFieldWrapper';
import { ICard } from '@/submodule/suit/types';
import { Timer } from '../Timer';
import { LocalStorageHelper } from '@/service/local-storage';
import { useMemo } from 'react';
import { UnitSelectionOverlay } from '@/component/ui/UnitSelectionOverlay';
import { ChoicePanel } from '@/feature/ChoicePanel';
import { PurpleGaugeView } from '@/component/ui/purpleGaugeView';

interface RoomProps {
  id: string;
}

export const Game = ({ id }: RoomProps) => {
  useGameComponentHook({ id });
  const { openCardsDialog } = useCardsDialog();
  const { cursorCollisionSize } = useSystemContext();

  // Get current player ID
  const currentPlayerId = LocalStorageHelper.playerId();

  const rule = useRule();
  const playerIds = Object.keys(usePlayers() ?? {});
  const oppenentId =
    useMemo(
      () => playerIds.find((id: string) => id !== currentPlayerId),
      [playerIds, currentPlayerId]
    ) ?? '';
  const opponent = usePlayer(oppenentId);

  const sensors = useSensors(
    // Primary sensor for desktop and touch devices
    useSensor(PointerSensor),
    // Fallback sensor specifically for touch devices
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150, // Longer delay for touch to prevent conflicts
        tolerance: 5,
      },
    })
  );

  // Custom collision detection that uses mouse cursor position instead of entire draggable area
  const cursorCollisionDetection: CollisionDetection = ({
    active,
    droppableContainers,
    droppableRects,
    pointerCoordinates,
  }) => {
    if (!pointerCoordinates) {
      return [];
    }

    // Create a small rectangle around the cursor using the configurable size
    const cursorRect: ClientRect = {
      width: cursorCollisionSize * 2,
      height: cursorCollisionSize * 2,
      top: pointerCoordinates.y - cursorCollisionSize,
      left: pointerCoordinates.x - cursorCollisionSize,
      bottom: pointerCoordinates.y + cursorCollisionSize,
      right: pointerCoordinates.x + cursorCollisionSize,
    };

    // Use the rectIntersection algorithm with our custom cursor rectangle
    return rectIntersection({
      active,
      droppableContainers,
      droppableRects,
      collisionRect: cursorRect,
      pointerCoordinates,
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={cursorCollisionDetection}
      modifiers={[restrictToWindowEdges]}
    >
      <div
        className={`flex h-screen ${colorTable.ui.background} ${colorTable.ui.text.primary} relative overflow-hidden select-none dnd-game-container`}
      >
        {/* カード詳細ウィンドウ */}
        <CardDetailWindow x={30} y={530} />

        {/* デバッグダイアログ */}
        <DebugDialog />

        {/* カード効果表示ダイアログ */}
        <CardEffectDialog />

        {/* カード使用エフェクト */}
        <CardUsageEffect />

        {/* 選択オーバーレイ */}
        <InterceptSelectionOverlay />
        <UnitSelectionOverlay />
        <ChoicePanel />

        {/* メインゲームコンテナ */}
        <div className="flex flex-col w-full h-full p-4">
          {/* 対戦相手エリア */}
          <div className={`flex-col p-4 border-b ${colorTable.ui.border}`}>
            {/* 対戦相手情報 */}
            <div
              className={`flex items-center justify-between p-2 ${colorTable.ui.playerInfoBackground} rounded-lg mb-4`}
            >
              <div className="player-identity">
                <div className="font-bold text-lg">{opponent?.name ?? '対戦相手 検索中…'}</div>
                <div className={`text-sm ${colorTable.ui.text.secondary}`}>オンライン</div>
              </div>
              {/* 対戦相手の手札エリア */}
              <div className="flex justify-center gap-2">
                {/* 対戦相手の手札は裏向きに表示 */}
                {opponent?.hand?.map(i => (
                  <div
                    key={`opponent-card-${i?.id}`}
                    className={`w-8 h-12 ${colorTable.ui.opponentCardBackground} rounded flex justify-center items-center shadow-md ${colorTable.symbols.mana} text-2xl`}
                  />
                ))}
              </div>
              <div className="flex">
                <div className="flex gap-1">
                  {[...Array(rule.player.max.trigger)].map((_, index) => {
                    const card = opponent?.trigger[index];
                    return card ? (
                      <div
                        className="w-10 h-13.5 border-1 border-white rounded-sm bg-gray-800"
                        style={{
                          backgroundImage: `url('/image/card/back/${'color' in card ? card.color : 'none'}.png')`,
                          backgroundSize: 'cover',
                        }}
                        key={index}
                      />
                    ) : (
                      <div
                        className="w-10 h-13.5 border-1 border-white rounded-sm bg-gray-800"
                        key={index}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-4">
                {opponent?.deck && (
                  <CardsCountView count={opponent.deck.length}>
                    <div
                      className="flex justify-center items-center cursor-pointer w-full h-full"
                      onClick={() => {
                        openCardsDialog(opponent.deck as ICard[], '対戦相手のデッキ');
                      }}
                    >
                      {<GiCardDraw color="cyan" size={40} />}
                    </div>
                  </CardsCountView>
                )}
                {opponent?.trash && (
                  <CardsCountView count={opponent.trash.length}>
                    <div
                      className="flex justify-center items-center cursor-pointer w-full h-full"
                      onClick={() => {
                        openCardsDialog(state => {
                          const trash = (state.players?.[oppenentId]?.trash ?? []) as ICard[];
                          const deleted = (state.players?.[oppenentId]?.delete ?? []) as ICard[];
                          return [
                            ...[...trash].reverse(),
                            ...deleted.map(card => ({ ...card, deleted: true })),
                          ]; // 最新の捨札カードが上に表示されるよう逆順に
                        }, '対戦相手の捨札');
                      }}
                    >
                      {<BsTrash3Fill color="yellowgreen" size={32} />}
                    </div>
                  </CardsCountView>
                )}
              </div>
              {opponent?.cp !== undefined && (
                <CPView current={opponent.cp.current} max={opponent.cp.max} />
              )}
              <PurpleGaugeView max={5} current={opponent?.purple} />
              {opponent?.life !== undefined && (
                <LifeView current={opponent.life.current} max={opponent.life.max} />
              )}
            </div>
          </div>

          {/* フィールドエリア */}
          <div
            className={`relative flex flex-col p-x-6 ${colorTable.ui.fieldBackground} rounded-lg my-4`}
          >
            {/* 対戦相手のフィールド */}
            <Field playerId={oppenentId} isOwnField={false} />
            <div className={`border-b border-dashed ${colorTable.ui.borderDashed} h-1`} />
            {/* 自分のフィールド */}
            <MyFieldWrapper>
              <Field playerId={LocalStorageHelper.playerId()} isOwnField={true} />
            </MyFieldWrapper>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
              <Timer />
            </div>
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
