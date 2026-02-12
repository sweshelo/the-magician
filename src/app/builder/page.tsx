import { DeckBuilder } from '@/feature/DeckBuilder';
import { defaultUIColors } from '@/helper/color';
import { getImplementedCardIds } from '@/helper/card';
import { getOriginalityMap } from '@/actions/originality';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Deck Builder',
};

function DeckBuilderWrapper({
  implementedIds,
  opMap,
}: {
  implementedIds: string[];
  opMap: Record<string, number>;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DeckBuilder implementedIds={implementedIds} opMap={opMap} />
    </Suspense>
  );
}

export default async function Page() {
  const [implementedIds, opMap] = await Promise.all([getImplementedCardIds(), getOriginalityMap()]);
  return (
    <div className={`min-h-screen select-none ${defaultUIColors.background}`}>
      <DeckBuilderWrapper implementedIds={implementedIds} opMap={opMap} />
    </div>
  );
}
