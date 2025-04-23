import { ICard, IUnit, Message } from '@/submodule/suit/types';
import { useCardEffectDialog } from '@/hooks/card-effect-dialog';
import { useWebSocketGame } from './websocket';
import { useCardsDialog } from '../cards-dialog';
import { useInterceptUsage } from '../intercept-usage';
import { useSoundV2 } from '../soundV2';
import { SelectionMode, useUnitSelection } from '../unit-selection';
import { useSystemContext } from '../system/hooks';
import { useCardUsageEffect } from '../card-usage-effect';
import { LocalStorageHelper } from '@/service/local-storage';
import { useTimer } from '@/feature/Timer/hooks';
import { GameState, useGameStore } from './context';

import { useAttackAnimation } from '../attack-animation';

export const useHandler = () => {
  const { sync } = useGameStore();
  const { continueGame, choose } = useWebSocketGame();
  const { showDialog } = useCardEffectDialog();
  const { setAvailableUnits, setCandidate, setAnimationUnit, setHandleSelected } =
    useUnitSelection();
  const { openCardsSelector } = useCardsDialog();
  const { setAvailableIntercepts } = useInterceptUsage();
  const { showCardUsageEffect } = useCardUsageEffect();
  const { play } = useSoundV2();
  const { setOperable } = useSystemContext();
  const { pauseTimer, resumeTimer } = useTimer();
  const { closeCardsDialog } = useCardsDialog();
  const { startAttackDeclaration, proceedToPreparation } = useAttackAnimation();

  // 仮のユニット座標取得関数（後で実装/差し替え）
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getUnitCenterPosition = (unitId: string): { x: number; y: number } | undefined => {
    // 実装例: window.unitPositionMap[unitId] など
    // if (typeof window !== 'undefined' && (window as any).unitPositionMap) {
    //   return (window as any).unitPositionMap[unitId];
    // }
    return undefined;
  };

  // 画面中央座標取得
  const getScreenCenterX = () => window.innerWidth / 2;

  const handle = async (message: Message) => {
    const { payload } = message;

    // 標準のメッセージ型の処理
    switch (payload.type) {
      case 'Sync': {
        const game: GameState = {
          ...payload.body,
        };
        sync(game);
        break;
      }

      // カード効果表示
      case 'DisplayEffect': {
        play('effect');
        setAnimationUnit(payload.unitId);
        await showDialog(payload.title, payload.message);
        continueGame({ promptId: payload.promptId });
        break;
      }

      // カード効果選択
      case 'Choices': {
        closeCardsDialog();

        const { choices } = payload;

        switch (choices.type) {
          case 'option':
            throw new Error('未実装の機能が呼び出されました');

          case 'card': {
            const response = await openCardsSelector(choices.items, choices.title, choices.count, {
              timeLimit: 10,
            });
            choose({ promptId: payload.promptId, choice: response });
            break;
          }

          case 'intercept': {
            const selectedCard = await handleInterceptSelection(choices.items);
            choose({
              promptId: payload.promptId,
              choice: selectedCard ? [selectedCard.id] : [],
            });
            break;
          }

          case 'unit': {
            const selectedUnit = await handleUnitSelection(choices.items);
            choose({
              promptId: payload.promptId,
              choice: selectedUnit ? [selectedUnit] : undefined,
            });
            break;
          }

          case 'block': {
            const selectedUnit = await handleUnitSelection(choices.items, 'block');
            choose({
              promptId: payload.promptId,
              choice: selectedUnit ? [selectedUnit] : undefined,
            });
            break;
          }
        }

        break;
      }

      // エフェクト通知
      case 'SoundEffect': {
        console.log('handling %s', payload.soundId);
        play(payload.soundId);
        break;
      }

      // ヴィジュアルエフェクト通知
      case 'VisualEffect': {
        const body = payload.body;
        switch (body.effect) {
          case 'attack': {
            // アタック宣言アニメ（declarationフェーズ）
            const attackerId = body.attackerId;
            const attackerPos = attackerId
              ? getUnitCenterPosition(attackerId)
              : { x: getScreenCenterX(), y: 0 };
            const isPlayerUnit =
              !!attackerId && attackerId.startsWith(LocalStorageHelper.playerId());
            startAttackDeclaration(
              attackerId,
              isPlayerUnit,
              attackerPos || { x: getScreenCenterX(), y: 0 }
            );
            break;
          }
          case 'launch': {
            // launchアニメ（着弾座標算出→proceedToPreparation）
            const attackerId = body.attackerId;
            const blockerId = body.blockerId;
            let targetPosition: { x: number; y: number };
            if (blockerId) {
              // blockerユニットの座標
              const blockerPos = getUnitCenterPosition(blockerId);
              targetPosition = blockerPos || { x: getScreenCenterX(), y: 0 };
            } else {
              // blockerIdがundefined: プレイヤー直接攻撃
              const isPlayerUnit =
                !!attackerId && attackerId.startsWith(LocalStorageHelper.playerId());
              if (isPlayerUnit) {
                targetPosition = { x: getScreenCenterX(), y: 20 };
              } else {
                targetPosition = { x: getScreenCenterX(), y: 600 };
              }
            }
            proceedToPreparation(targetPosition);
            break;
          }
          case 'drive': {
            // type guard
            if ('type' in body && 'player' in body && 'image' in body) {
              const position =
                body.type === 'UNIT'
                  ? body.player === LocalStorageHelper.playerId()
                    ? 'right'
                    : 'left'
                  : 'center';
              showCardUsageEffect({
                image: body.image,
                type: body.type,
                position,
              });
            }
            break;
          }
        }
        break;
      }

      // 操作権限
      case 'Operation': {
        switch (payload.action) {
          case 'defrost':
            resumeTimer();
            setOperable(true);
            break;
          case 'freeze':
            pauseTimer();
            setOperable(false);
            break;
        }
        break;
      }
    }
  };

  // Handle intercept selection by returning a Promise that resolves with the selected card or null
  const handleInterceptSelection = (intercepts: ICard[]): Promise<ICard | null> => {
    return new Promise(resolve => {
      // Setup handler functions that resolve the promise
      const handleActivate = (card: ICard) => {
        resolve(card);
      };

      const handleCancel = () => {
        resolve(null);
      };

      // Set available intercepts and provide the handlers
      setAvailableIntercepts(intercepts, undefined, handleActivate, handleCancel);
    });
  };

  const handleUnitSelection = (
    units: IUnit[],
    mode: SelectionMode = 'target'
  ): Promise<IUnit['id'] | undefined> => {
    return new Promise(resolve => {
      // Setup handler functions that resolve the promise
      const handleSelect = (unit?: IUnit['id']) => {
        resolve(unit);
        setCandidate(undefined);
        setHandleSelected(undefined);
      };

      setAvailableUnits(units, handleSelect, mode);
    });
  };

  return { handle, showDialog, handleInterceptSelection, handleUnitSelection };
};
