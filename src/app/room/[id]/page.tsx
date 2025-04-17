import { Game } from '@/feature/Game';
import { UnitSelectionProvider } from '@/hooks/unit-selection';
import { GameContextProvider } from '@/hooks/game/GameContextProvider';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <GameContextProvider>
      <UnitSelectionProvider>
        <Game id={id} />
      </UnitSelectionProvider>
    </GameContextProvider>
  );
}
