'use client';

import { useState } from 'react';
import { getImageUrl } from '@/helper/image';
import master from '@/submodule/suit/catalog/catalog';
import { DeckPreview } from '@/feature/DeckBuilder/DeckPreview';
import type { ICard } from '@/submodule/suit/types';

interface Deck {
  cards: string[];
  jokers: string[];
}

const DECK_PREVIEW_COUNT = 5;

function InlinePreview({ deck }: { deck: string[] }) {
  const previewCards = deck.slice(0, DECK_PREVIEW_COUNT);
  const remaining = deck.length - DECK_PREVIEW_COUNT;

  return (
    <div className="flex items-center gap-0.5">
      {previewCards.map((cardId, i) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={`${cardId}-${i}`}
          src={getImageUrl(cardId, 'small')}
          alt={master.get(cardId)?.name ?? cardId}
          title={master.get(cardId)?.name ?? cardId}
          className="w-7 h-7 object-cover rounded"
        />
      ))}
      {remaining > 0 && <span className="text-xs text-gray-400 ml-1">+{remaining}枚</span>}
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
        className="cursor-pointer hover:opacity-80 transition-opacity"
      >
        <InlinePreview deck={deck.cards} />
      </button>
      {isOpen && <DeckPreview deck={deckForPreview} onClose={() => setIsOpen(false)} />}
    </>
  );
}
