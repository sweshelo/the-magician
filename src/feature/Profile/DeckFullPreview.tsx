'use client';

import { useCallback, useState } from 'react';
import master from '@/submodule/suit/catalog/catalog';
import { DeckPreview } from '@/feature/DeckBuilder/DeckPreview';
import { colorTable } from '@/helper/color';
import type { ICard } from '@/submodule/suit/types';
import { RichButton } from '@/component/ui/RichButton';
import { useDeck } from '@/hooks/deck';
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

export function DeckFullPreview({ deck, isOwns }: { deck: Deck; isOwns?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  const deckForPreview = {
    cards: deck.cards.map(id => ({ catalogId: id }) as ICard),
    joker: deck.jokers.map(id => ({ id }) as ICard),
  };

  const { saveDeck, decks } = useDeck();
  const handleSaveDeck = useCallback(() => {
    const deckName = prompt('デッキ名を入力してください');

    if (!deckName || !deckName.trim()) {
      alert('デッキ名が必要です');
      return;
    }

    // タイトル重複チェック
    if (decks.some(d => d.title === deckName.trim())) {
      alert('同じ名前のデッキが既に存在します');
      return;
    }

    // 保存
    saveDeck(deckName.trim(), deck.cards, deck.jokers, false)
      .then(() => alert('保存しました'))
      .catch(() => alert('保存に失敗しました'));
  }, [saveDeck, decks, deck.cards, deck.jokers]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full cursor-pointer hover:opacity-80 transition-opacity"
      >
        <DeckColorBar cards={deck.cards} />
      </button>
      {isOpen && (
        <DeckPreview deck={deckForPreview} onClose={() => setIsOpen(false)}>
          {!isOwns ? (
            <RichButton colorScheme="blue" onClick={handleSaveDeck}>
              自分のデッキに保存する
            </RichButton>
          ) : null}
        </DeckPreview>
      )}
    </>
  );
}
