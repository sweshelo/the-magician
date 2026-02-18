'use client';

import { useCallback, useState } from 'react';
import { DeckPreview } from '@/feature/DeckBuilder/DeckPreview';
import { RichButton } from '@/component/ui/RichButton';
import { useDeck } from '@/hooks/deck';
import { DeckColorBar } from '@/component/ui/DeckColorBar';

interface Deck {
  cards: string[];
  jokers: string[];
}

export function DeckFullPreview({ deck, isOwns }: { deck: Deck; isOwns?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

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
        <DeckPreview deck={deck} onClose={() => setIsOpen(false)}>
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
