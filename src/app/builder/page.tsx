import { DeckBuilder } from '@/feature/DeckBuilder';
import { defaultUIColors } from '@/helper/color';
import { getImplementedCardIds } from '@/helper/card';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Deck Builder',
};

function DeckBuilderWrapper({ implementedIds }: { implementedIds: string[] }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DeckBuilder implementedIds={implementedIds} />
    </Suspense>
  );
}

export default async function Page() {
  const implementedIds: string[] = await getImplementedCardIds();
  return (
    <div className={`min-h-screen select-none ${defaultUIColors.background}`}>
      <DeckBuilderWrapper implementedIds={implementedIds} />
    </div>
  );
}
