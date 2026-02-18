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
  const { decks, mainDeck, setMainDeck, deleteDeck, setDeckPublic } = useDeck();
  const { opMap, isLoading: isOpLoading } = useOriginalityMap();

  const handleSetMainDeck = async (deckId: string) => {
    try {
      await setMainDeck(deckId);
    } catch (error) {
      console.error('メインデッキ設定エラー:', error);
      alert('メインデッキの設定に失敗しました');
    }
  };

  const handleDeleteDeck = async (deckId: string, deckTitle: string) => {
    if (!confirm(`「${deckTitle}」を削除してもよろしいですか？`)) return;
    try {
      await deleteDeck(deckId);
    } catch (error) {
      console.error('デッキ削除エラー:', error);
      alert('デッキの削除に失敗しました');
    }
  };

  const handleTogglePublic = async (deckId: string, currentIsPublic: boolean) => {
    try {
      await setDeckPublic(deckId, !currentIsPublic);
    } catch (error) {
      console.error('公開状態切り替えエラー:', error);
      alert('公開状態の切り替えに失敗しました');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-6">デッキ管理</h1>
      <div className="border rounded border-green-500 bg-green-900 my-2 p-2 text-xs">
        <p>
          カラーバーをクリックするとデッキをプレビューできます
          <br />
          デッキのタイトルをクリックするとデッキのページが開きます
          <br />
          公開中のデッキのURLを他の人に共有すると、他の人がデッキを自由に保存できるようになります
        </p>
      </div>

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
              >
                {/* タイトル・メタ情報: クリックでデッキ詳細ページへ遷移 */}
                <Link
                  href={`/deck/${deck.id}`}
                  className="block cursor-pointer hover:opacity-80 transition-opacity mb-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{deck.title}</span>
                      {isMain && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                          メインデッキ
                        </span>
                      )}
                      {deck.is_public && (
                        <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                          公開中
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
                </Link>

                {/* カラーバー: クリックでモーダルプレビュー表示 */}
                <button
                  onClick={() => {
                    setPreviewDeck(deck);
                    setIsOpen(true);
                  }}
                  className="w-full cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <DeckColorBar cards={deck.cards} />
                </button>

                {/* アクションボタン群 */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => handleTogglePublic(deck.id, deck.is_public ?? false)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      deck.is_public
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-600 text-white hover:bg-gray-500'
                    }`}
                  >
                    {deck.is_public ? '公開中' : '非公開'}
                  </button>
                  <button
                    onClick={() => handleDeleteDeck(deck.id, deck.title)}
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
