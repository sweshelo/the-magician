import { Message } from "@/submodule/suit/types"
import { useGame } from "./hooks";
import { GameState } from "./reducer";
import { useCardEffectDialog } from "@/hooks/card-effect-dialog";
import { useWebSocketGame } from "./websocket";
import { useCardsDialog } from "../cards-dialog";

export const useHandler = () => {
  const { setAll } = useGame();
  const { continueGame, choose } = useWebSocketGame();
  const { showDialog } = useCardEffectDialog();
  const { openCardsSelector } = useCardsDialog();

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
      }
    }
  }

  return { handle, showDialog }
}
