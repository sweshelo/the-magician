import { Game } from '@/feature/Game';
import { UnitSelectionProvider } from '@/hooks/unit-selection';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <UnitSelectionProvider>
        <Game id={id} />
      </UnitSelectionProvider>
    </>
  );
}
