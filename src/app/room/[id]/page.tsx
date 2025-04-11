import { Game } from "@/feature/Game";
import { GameProvider } from "@/hooks/game";
import { UnitSelectionProvider } from "@/hooks/unit-selection";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <GameProvider>
        <UnitSelectionProvider>
          <Game id={id} />
        </UnitSelectionProvider>
      </GameProvider>
    </>
  );
}
