import { ICard, Message } from "@/submodule/suit/types"
import { useGame } from "./hooks";
import { GameState } from "./reducer";
import { useCardEffectDialog } from "@/hooks/card-effect-dialog";
import { useWebSocketGame } from "./websocket";
import { useCardsDialog } from "../cards-dialog";
import { useInterceptUsage } from "../intercept-usage";
import { useSoundEffect } from "../sound";

export const useHandler = () => {
  const { setAll } = useGame();
  const { continueGame, choose } = useWebSocketGame();
  const { showDialog } = useCardEffectDialog();
  const { openCardsSelector } = useCardsDialog();
  const { setAvailableIntercepts } = useInterceptUsage();
  const { play } = useSoundEffect()

  const handle = async (message: Message) => {
    const { payload } = message;

    // 標準のメッセージ型の処理
    switch (payload.type) {
      case 'Sync': {
        const game: GameState = {
          ...payload.body.game,
          players: payload.body.players
        }
        setAll(game);
        break;
      }

      // カード効果表示
      case 'DisplayEffect': {
        play('effect')
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

        break;
      }

      // エフェクト通知
      case 'SoundEffect': {
        console.log('handling %s', payload.soundId)
        play(payload.soundId)
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

  return { handle, showDialog, handleInterceptSelection }
}
