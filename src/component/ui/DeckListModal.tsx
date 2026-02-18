'use client';

import { useEffect } from 'react';
import type { DeckData } from '@/type/deck';
import { originality } from '@/helper/originality';

interface DeckListModalProps {
  isOpen: boolean;
  onClose: () => void;
  decks: DeckData[];
  mainDeckId: string | null;
  onSelectDeck: (deckId: string) => void;
  originalityMap: Record<string, number>;
  isOriginalityLoading: boolean;
}

export const DeckListModal = ({
  isOpen,
  onClose,
  decks,
  mainDeckId,
  onSelectDeck,
  originalityMap,
  isOriginalityLoading,
}: DeckListModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="decklist-modal-title"
    >
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <h4 id="decklist-modal-title" className="text-lg font-semibold text-white mb-4">
          デッキを選択
        </h4>

        {decks.length === 0 ? (
          <p className="text-gray-400 text-center py-4">保存されたデッキがありません</p>
        ) : (
          <div className="space-y-2">
            {decks.map(deck => (
              <div
                key={deck.id}
                role="button"
                tabIndex={0}
                className={`p-3 rounded-md border cursor-pointer transition-colors ${
                  mainDeckId === deck.id
                    ? 'bg-blue-700 border-blue-500'
                    : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                }`}
                onClick={() => onSelectDeck(deck.id)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectDeck(deck.id);
                  }
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{deck.title}</span>
                  <div className="flex gap-2 items-center">
                    {(deck.jokers?.length ?? 0) < 2 && (
                      <span className="text-red-400 text-sm">JOKERなし</span>
                    )}
                    <span className="text-gray-400 text-sm">
                      {isOriginalityLoading
                        ? '...'
                        : originality([...deck.cards, ...(deck.jokers ?? [])], originalityMap)}
                      P
                    </span>
                    <span className="text-gray-400 text-sm">{deck.cards.length}枚</span>
                  </div>
                </div>
                {mainDeckId === deck.id && (
                  <span className="text-blue-300 text-xs">現在のメインデッキ</span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
