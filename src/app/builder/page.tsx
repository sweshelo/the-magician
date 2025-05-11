import { DeckBuilder } from '@/feature/DeckBuilder';
import { colorTable } from '@/helper/color';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deck Builder',
};

export default function Page() {
  return (
    <div className={`min-h-screen select-none ${colorTable.ui.background}`}>
      <DeckBuilder />
    </div>
  );
}
