import { Game } from "@/feature/game/Game";
import { GameProvider } from "@/hooks/game";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  return (
    <>
      <GameProvider>
        <Game id={id} />
      </GameProvider>
    </>
  )
}