import { ICard, IUnit, Message } from "@/submodule/suit/types"
import { useGame } from "./hooks";
import { GameState } from "./reducer";
import { useCardEffectDialog } from "@/hooks/card-effect-dialog";
import { useWebSocketGame } from "./websocket";
import { useCardsDialog } from "../cards-dialog";
import { useInterceptUsage } from "../intercept-usage";
import { useSoundEffect } from "../sound";
import { SelectionMode, useUnitSelection } from "../unit-selection";
import { useSystemContext } from "../system/hooks";

export const useHandler = () => {
  const { setAll } = useGame();
  const { continueGame, choose } = useWebSocketGame();
  const { showDialog } = useCardEffectDialog();
  const { setAvailableUnits, setCandidate, setAnimationUnit } = useUnitSelection()
  const { openCardsSelector } = useCardsDialog();
  const { setAvailableIntercepts } = useInterceptUsage();
  const { play } = useSoundEffect()
  const { setOperable } = useSystemContext()

  const handle = async (message: Message) => {
    const { payload } = message;

    // 標準のメッセージ型の処理
    switch (payload.type) {
      case 'Sync': {
        const game: GameState = {
          ...payload.body,
        }
        setAll(game);
        break;
      }

      // カード効果表示
      case 'DisplayEffect': {
        play('effect')
        setAnimationUnit(payload.unitId);
        await showDialog(payload.title, payload.message);
        continueGame({ promptId: payload.promptId });
        break;
      }

      // カード効果選択
      case 'Choices': {
        const { choices } = payload
        if (choices.type === 'option') {
          // 知らん
        }

        if (choices.type === 'card') {
          const response = await openCardsSelector(choices.items, choices.title, choices.count, { timeLimit: 10 });
          choose({ promptId: payload.promptId, choice: response });
          break;
        }

        if (choices.type === 'intercept') {
          const selectedCard = await handleInterceptSelection(choices.items);
          choose({
            promptId: payload.promptId,
            choice: selectedCard ? [selectedCard.id] : []
          });
        }

        if (choices.type === 'unit') {
          const selectedUnit = await handleUnitSelection(choices.items);
          choose({
            promptId: payload.promptId,
            choice: [selectedUnit]
          })
        }

        break;
      }

      // エフェクト通知
      case 'SoundEffect': {
        console.log('handling %s', payload.soundId)
        play(payload.soundId)
        break;
      }

      // 操作権限
      case 'Operation': {
        switch(payload.action){
          case 'defrost':
            setOperable(true);
            break;
          case 'freeze':
            setOperable(false);
            break;
        };
        break;
      }
    }
  }

  // Handle intercept selection by returning a Promise that resolves with the selected card or null
  const handleInterceptSelection = (intercepts: ICard[]): Promise<ICard | null> => {
    return new Promise((resolve) => {
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

  const handleUnitSelection = (units: IUnit[], mode: SelectionMode = 'target'): Promise<IUnit['id']> => {
    return new Promise((resolve) => {
      // Setup handler functions that resolve the promise
      const handleSelect = (unit: IUnit['id']) => {
        resolve(unit);
        setCandidate(undefined);
      };

      // Set available intercepts and provide the handlers
      setAvailableUnits(units, handleSelect, mode);
    });
  };

  return { handle, showDialog, handleInterceptSelection, handleUnitSelection }
}
