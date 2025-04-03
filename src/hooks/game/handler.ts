import { Message } from "@/submodule/suit/types"
import { useGame } from "./hooks";
import { GameState } from "./reducer";
import { useCardEffectDialog } from "@/hooks/card-effect-dialog";
import { useWebSocketGame } from "./websocket";

export const useHandler = () => {
  const { setAll } = useGame();
  const { continueGame } = useWebSocketGame();
  const { showDialog } = useCardEffectDialog();

  const handle = async(message: Message) => {
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
    }
  }

  return { handle, showDialog }
}
