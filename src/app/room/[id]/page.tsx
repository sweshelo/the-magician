import { Game } from "@/feature/game/Game";
import { GameProvider } from "@/hooks/game";

export default function Page() {
  return (
    <>
      <GameProvider>
        <Game />
      </GameProvider>
    </>
  )
}