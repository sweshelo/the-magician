import { Game } from '@/feature/Game';
import { GameContextProvider } from '@/hooks/game/GameContextProvider';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <GameContextProvider>
      <Game id={id} />
    </GameContextProvider>
  );
}
