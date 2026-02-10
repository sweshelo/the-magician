'use client';

import { useState } from 'react';
import master from '@/submodule/suit/catalog/catalog';
import { DeckPreview } from '@/feature/DeckBuilder/DeckPreview';
import { colorTable } from '@/helper/color';
import type { ICard } from '@/submodule/suit/types';

interface Deck {
  cards: string[];
  jokers: string[];
}

const defaultHex = colorTable.cardColorHex[0];

function DeckColorBar({ cards }: { cards: string[] }) {
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
  for (const [color, { normal, intercept }] of counts) {
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

export function DeckFullPreview({ deck }: { deck: Deck | null }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!deck || deck.cards.length === 0) {
    return <span className="text-gray-400 text-xs">-</span>;
  }

  const deckForPreview = {
    cards: deck.cards.map(id => ({ catalogId: id }) as ICard),
    joker: deck.jokers.map(id => ({ id }) as ICard),
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full cursor-pointer hover:opacity-80 transition-opacity"
      >
        <DeckColorBar cards={deck.cards} />
      </button>
      {isOpen && <DeckPreview deck={deckForPreview} onClose={() => setIsOpen(false)} />}
    </>
  );
}
