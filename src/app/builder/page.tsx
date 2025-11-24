import { DeckBuilder } from '@/feature/DeckBuilder';
import { colorTable } from '@/helper/color';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Deck Builder',
};

async function getImplementedCardIds() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SECURE_CONNECTION === 'true' ? 'https://' : 'http://'}${process.env.NEXT_PUBLIC_SERVER_HOST}/api/cards`
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

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
    <div className={`min-h-screen select-none ${colorTable.ui.background}`}>
      <DeckBuilderWrapper implementedIds={implementedIds} />
    </div>
  );
}
