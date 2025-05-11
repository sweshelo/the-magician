import { DeckBuilder } from '@/feature/DeckBuilder';
import { colorTable } from '@/helper/color';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deck Builder',
};

async function getImplementedCardIds() {
  const res = await fetch(`https://${process.env.NEXT_PUBLIC_WEBSOCKET_HOST}/api/cards`);
  if (!res.ok) return [];
  return await res.json();
}

export default async function Page() {
  const implementedIds: string[] = await getImplementedCardIds();
  return (
    <div className={`min-h-screen select-none ${colorTable.ui.background}`}>
      <DeckBuilder implementedIds={implementedIds} />
    </div>
  );
}
