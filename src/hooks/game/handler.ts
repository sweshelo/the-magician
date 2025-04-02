import { Message } from "@/submodule/suit/types"
import { useGame } from "./hooks";
import { GameState } from "./reducer";
import { useCardEffectDialog } from "@/hooks/card-effect-dialog";

export const useHandler = () => {
  const { setAll } = useGame();
  const { showDialog } = useCardEffectDialog();

  // カード効果をダイアログで表示する関数
  const showCardEffect = (title: string, message: string) => {
    showDialog(title, message);
  };

  const handle = (message: Message) => {
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
        showCardEffect(payload.title, payload.message);
        break;
      }
    }
  }

  return { handle, showCardEffect }
}
