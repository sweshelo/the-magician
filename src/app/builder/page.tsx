import { DeckBuilder } from '@/feature/DeckBuilder';
import { colorTable } from '@/helper/color';

export default function Page() {
  return (
    <div className={`min-h-screen select-none ${colorTable.ui.background}`}>
      <DeckBuilder />
    </div>
  );
}
