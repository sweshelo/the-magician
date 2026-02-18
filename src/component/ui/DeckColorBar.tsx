import master from '@/submodule/suit/catalog/catalog';
import { colorTable } from '@/helper/color';

const defaultHex = colorTable.cardColorHex[0];

export function DeckColorBar({ cards }: { cards: string[] }) {
  const counts = new Map<number, { normal: number; intercept: number }>();

  for (const cardId of cards) {
    const catalog = master.get(cardId);
    const color = catalog?.color ?? 0;
    const isIntercept = catalog?.type === 'intercept';
    const entry = counts.get(color) ?? { normal: 0, intercept: 0 };
    if (isIntercept) {
      entry.intercept++;
    } else {
      entry.normal++;
    }
    counts.set(color, entry);
  }

  const segments: { flexGrow: number; backgroundColor: string }[] = [];
  for (const [color, { normal, intercept }] of [...counts.entries()].sort((a, b) => a[0] - b[0])) {
    const hex =
      colorTable.cardColorHex[color as keyof typeof colorTable.cardColorHex] ?? defaultHex;
    if (normal > 0) {
      segments.push({ flexGrow: normal, backgroundColor: hex.normal });
    }
    if (intercept > 0) {
      segments.push({ flexGrow: intercept, backgroundColor: hex.dark });
    }
  }

  return (
    <div className="h-4 w-full rounded overflow-hidden flex">
      {segments.map((style, i) => (
        <div key={i} style={style} />
      ))}
    </div>
  );
}
