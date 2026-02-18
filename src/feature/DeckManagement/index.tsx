'use client';

import { useDeck } from '@/hooks/deck';
import { useOriginalityMap } from '@/hooks/originality';
import { DeckColorBar } from '@/component/ui/DeckColorBar';
import { originality } from '@/helper/originality';
import Link from 'next/link';
import { useState } from 'react';
import { DeckData } from '@/type/deck';
import { DeckPreview } from '../DeckBuilder/DeckPreview';

export const DeckManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewDeck, setPreviewDeck] = useState<DeckData>();
  const { decks, mainDeck, setMainDeck, deleteDeck } = useDeck();
  const { opMap, isLoading: isOpLoading } = useOriginalityMap();

  const handleSetMainDeck = async (deckId: string) => {
    try {
      await setMainDeck(deckId);
    } catch (error) {
      console.error('メインデッキ設定エラー:', error);
    }
  };

  const handleDeleteDeck = async (deckId: string, deckTitle: string) => {
    if (!confirm(`「${deckTitle}」を削除してもよろしいですか？`)) return;
    try {
      await deleteDeck(deckId);
    } catch (error) {
      console.error('デッキ削除エラー:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-6">デッキ管理</h1>

      <div className="mb-4">
        <Link
          href="/builder"
          className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          デッキを作成
        </Link>
      </div>

      {decks.length === 0 ? (
        <div className="bg-gray-800 p-8 rounded-lg text-center">
          <p className="text-gray-400">保存されたデッキがありません</p>
          <p className="text-gray-500 text-sm mt-2">デッキビルダーでデッキを作成してください。</p>
        </div>
      ) : (
        <div className="space-y-3">
          {decks.map(deck => {
            const isMain = mainDeck?.id === deck.id;
            return (
              <div
                key={deck.id}
                className={`p-4 rounded-lg border ${
                  isMain ? 'bg-blue-900/40 border-blue-500' : 'bg-gray-800 border-gray-700'
                }`}
                onClick={() => {
                  setPreviewDeck(deck);
                  setIsOpen(true);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{deck.title}</span>
                    {isMain && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                        メインデッキ
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    {(deck.jokers?.length ?? 0) < 2 && (
                      <span className="text-red-400">JOKERなし</span>
                    )}
                    <span className="text-gray-400">
                      {isOpLoading
                        ? '...'
                        : originality([...deck.cards, ...(deck.jokers ?? [])], opMap)}
                      P
                    </span>
                    <span className="text-gray-400">{deck.cards.length}枚</span>
                  </div>
                </div>

                <DeckColorBar cards={deck.cards} />

                <div className="flex items-center gap-2 mt-3 z-10">
                  {!isMain && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleSetMainDeck(deck.id);
                      }}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      メインデッキに設定
                    </button>
                  )}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteDeck(deck.id, deck.title);
                    }}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    削除
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {isOpen && previewDeck && <DeckPreview deck={previewDeck} onClose={() => setIsOpen(false)} />}
    </div>
  );
};
