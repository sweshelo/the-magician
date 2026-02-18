'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DeckCardGrid } from '@/component/ui/DeckCardGrid';
import { DeckColorBar } from '@/component/ui/DeckColorBar';
import { RichButton } from '@/component/ui/RichButton';
import { useAuth } from '@/hooks/auth';
import { useDeck } from '@/hooks/deck';
import { useOriginalityMap } from '@/hooks/originality';
import { originality } from '@/helper/originality';
import { toggleDeckPublic } from '@/actions/deck';
import type { DeckDetailResponse } from '@/actions/deck';

type DeckDetailProps = {
  deck: NonNullable<DeckDetailResponse>;
};

export const DeckDetail = ({ deck }: DeckDetailProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const { saveDeck, decks } = useDeck();
  const { opMap, isLoading: isOpLoading } = useOriginalityMap();
  const [isPublic, setIsPublic] = useState(deck.is_public);

  const isOwner = user?.id === deck.owner.id;

  const handleSaveDeck = useCallback(() => {
    const deckName = prompt('デッキ名を入力してください');

    if (!deckName || !deckName.trim()) {
      alert('デッキ名が必要です');
      return;
    }

    if (decks.some(d => d.title === deckName.trim())) {
      alert('同じ名前のデッキが既に存在します');
      return;
    }

    saveDeck(deckName.trim(), deck.cards, deck.jokers, false)
      .then(() => alert('保存しました'))
      .catch(() => alert('保存に失敗しました'));
  }, [saveDeck, decks, deck.cards, deck.jokers]);

  const handleTogglePublic = useCallback(async () => {
    const result = await toggleDeckPublic(deck.id);
    if (result) {
      setIsPublic(result.is_public);
    } else {
      alert('公開状態の切り替えに失敗しました');
    }
  }, [deck.id]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">{deck.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>by {deck.owner.displayName}</span>
          <span>
            {isOpLoading ? '...' : originality([...deck.cards, ...(deck.jokers ?? [])], opMap)}P
          </span>
          <span>{deck.cards.length}枚</span>
          {(deck.jokers?.length ?? 0) < 2 && <span className="text-red-400">JOKERなし</span>}
          {isPublic && <span className="text-green-400">公開中</span>}
        </div>
        <div className="mt-3">
          <DeckColorBar cards={deck.cards} />
        </div>
      </div>

      <div className="flex flex-col items-center">
        <DeckCardGrid cards={deck.cards} jokers={deck.jokers} />
        <div className="mt-6 flex justify-center gap-2">
          <RichButton onClick={() => router.back()}>閉じる</RichButton>
          {isOwner && (
            <RichButton colorScheme="blue" onClick={handleTogglePublic}>
              {isPublic ? 'デッキを非公開にする' : 'デッキを公開する'}
            </RichButton>
          )}
          {!isOwner && (
            <RichButton colorScheme="blue" onClick={handleSaveDeck}>
              自分のデッキに保存する
            </RichButton>
          )}
        </div>
      </div>
    </div>
  );
};
