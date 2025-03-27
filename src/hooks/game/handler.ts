import { Message } from "@/submodule/suit/types"
import { useGame } from "./hooks";
import { GameState } from "./reducer";

export const useHandler = () => {
  const { setAll } = useGame();

  const handle = (message: Message) => {
    const { payload } = message;
    switch (payload.type) {
      case 'Sync': {
        const game: GameState = {
          ...payload.body.game,
          players: payload.body.players
        }
        setAll(game);
      }
    }
  }

  return { handle }
}