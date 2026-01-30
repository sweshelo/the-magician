'use client';

import { useDeck } from '@/hooks/deck';
import type { DeckData } from '@/type/deck';
import { useState, useEffect } from 'react';

interface DeckSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, isMainDeck: boolean) => void;
  deck: string[];
  jokers?: string[];
}

interface DeckListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (deck: DeckData) => void;
}

export const DeckSaveDialog = ({
  isOpen,
  onClose,
  onSave,
  deck,
  jokers = [],
}: DeckSaveDialogProps) => {
  const { decks, saveDeck, refreshDecks } = useDeck();
  const [title, setTitle] = useState('');
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [saveMode, setSaveMode] = useState<'new' | 'overwrite'>('new');
  const [isMainDeck, setIsMainDeck] = useState(false);

  // デッキコピー・インポート用
  const [copyFeedback, setCopyFeedback] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle(''); // Reset title
      setSelectedDeck(null); // Reset selection
      setSaveMode('new'); // Default to new
    }
  }, [isOpen]);

  const handleSave = () => {
    const finalTitle = saveMode === 'new' ? title : selectedDeck!;
    if (!finalTitle.trim()) {
      alert('デッキのタイトルを入力してください。');
      return;
    }

    onSave(finalTitle, isMainDeck);
    onClose();
  };

  const handleDeckSelect = (deckTitle: string) => {
    setSelectedDeck(deckTitle);
    setSaveMode('overwrite');
  };

  const handleImport = async () => {
    setImportError('');
    setImportSuccess('');
    try {
      const obj = JSON.parse(importText);
      if (!obj.cards || !Array.isArray(obj.cards)) {
        setImportError('cards配列が見つかりません');
        return;
      }
      if (obj.cards.length !== 40) {
        setImportError('デッキは40枚である必要があります');
        return;
      }

      // JOKER検証
      const importJokers = obj.jokers || [];
      if (!Array.isArray(importJokers)) {
        setImportError('jokersは配列である必要があります');
        return;
      }
      if (importJokers.length > 2) {
        setImportError('JOKERは最大2枚までです');
        return;
      }

      // タイトル入力
      const newTitle = prompt('デッキ名を入力してください');
      if (!newTitle || !newTitle.trim()) {
        setImportError('デッキ名が必要です');
        return;
      }
      // タイトル重複チェック
      if (decks.some(d => d.title === newTitle.trim())) {
        setImportError('同じ名前のデッキが既に存在します');
        return;
      }
      // 保存
      await saveDeck(newTitle.trim(), obj.cards, importJokers, false);
      setImportSuccess('デッキを作成しました');
      await refreshDecks();
    } catch {
      setImportError('JSONのパースに失敗しました');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-white">デッキを保存</h2>

        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <button
              className={`px-3 py-1 rounded ${saveMode === 'new' ? 'bg-blue-500 text-white' : 'bg-gray-600'}`}
              onClick={() => setSaveMode('new')}
            >
              新規作成
            </button>
            <button
              className={`px-3 py-1 rounded ${saveMode === 'overwrite' ? 'bg-blue-500 text-white' : 'bg-gray-600'}`}
              onClick={() => setSaveMode('overwrite')}
              disabled={decks.length === 0}
            >
              上書き
            </button>
          </div>

          {saveMode === 'new' ? (
            <div>
              <label className="block text-white mb-2">デッキ名</label>
              <input
                type="text"
                className="w-full p-2 border rounded bg-gray-700 text-white"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="デッキ名を入力"
                autoFocus
              />
              <div className="mt-4">
                <label className="flex items-center text-white cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4"
                    checked={isMainDeck}
                    onChange={e => setIsMainDeck(e.target.checked)}
                  />
                  メインのデッキにする
                </label>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-white mb-2">上書きするデッキを選択</label>
              <div className="max-h-60 overflow-y-auto bg-gray-700 rounded">
                {decks.map(deckItem => (
                  <div
                    key={deckItem.title}
                    className={`p-2 cursor-pointer hover:bg-gray-600 ${
                      selectedDeck === deckItem.title ? 'bg-blue-500' : ''
                    }`}
                    onClick={() => handleDeckSelect(deckItem.title)}
                  >
                    <span className="text-white">{deckItem.title}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <label className="flex items-center text-white cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4"
                    checked={isMainDeck}
                    onChange={e => setIsMainDeck(e.target.checked)}
                  />
                  メインのデッキにする
                </label>
              </div>
            </div>
          )}
        </div>

        {/* --- デッキ内容コピー/インポート機能 --- */}
        <div className="mt-6 border-t border-gray-600 pt-4">
          {/* コピー */}
          <div className="mb-4">
            <button
              className="px-3 py-1 bg-green-600 text-white rounded"
              onClick={async () => {
                try {
                  const json = JSON.stringify({ cards: deck, jokers }, null, 2);
                  await navigator.clipboard.writeText(json);
                  setCopyFeedback('デッキ内容をコピーしました');
                  setTimeout(() => setCopyFeedback(''), 2000);
                } catch {
                  setCopyFeedback('コピーに失敗しました');
                  setTimeout(() => setCopyFeedback(''), 2000);
                }
              }}
            >
              デッキ内容をコピー
            </button>
            {copyFeedback && <span className="ml-3 text-sm text-green-300">{copyFeedback}</span>}
          </div>
          {/* インポート */}
          <div>
            <button
              className="px-3 py-1 bg-purple-600 text-white rounded"
              onClick={() => {
                setShowImport(v => !v);
                setImportText('');
                setImportError('');
                setImportSuccess('');
              }}
            >
              デッキ内容から作成
            </button>
          </div>
          {showImport && (
            <div className="mt-4 bg-gray-700 p-3 rounded">
              <label className="block text-white mb-2">デッキJSONを貼り付け</label>
              <textarea
                className="w-full p-2 rounded bg-gray-800 text-white mb-2"
                rows={4}
                value={importText}
                onChange={e => {
                  setImportText(e.target.value);
                  setImportError('');
                  setImportSuccess('');
                }}
                placeholder='{"cards": [...]}'
              />
              <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={handleImport}>
                デッキ作成
              </button>
              {importError && <div className="text-red-400 mt-2">{importError}</div>}
              {importSuccess && <div className="text-green-300 mt-2">{importSuccess}</div>}
            </div>
          )}
        </div>
        {/* --- 既存の保存/キャンセルボタン --- */}
        <div className="flex justify-end gap-2 mt-6">
          <button className="px-4 py-2 bg-gray-600 text-white rounded" onClick={onClose}>
            キャンセル
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-800 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={
              (saveMode === 'new' && !title.trim()) ||
              (saveMode === 'overwrite' && !selectedDeck) ||
              deck.length !== 40
            }
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export const DeckLoadDialog = ({ isOpen, onClose, onLoad }: DeckListDialogProps) => {
  const { decks, mainDeck, setMainDeck, deleteDeck, refreshDecks } = useDeck();

  useEffect(() => {
    if (isOpen) {
      refreshDecks();
    }
  }, [isOpen, refreshDecks]);

  const handleLoadDeck = (deck: DeckData) => {
    onLoad(deck);
    onClose();
  };

  const handleSetMainDeck = async (deckId: string) => {
    try {
      await setMainDeck(deckId);
    } catch (error) {
      console.error('メインデッキ設定エラー:', error);
    }
  };

  const handleDeleteDeck = async (deckId: string, deckTitle: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm(`「${deckTitle}」を削除してもよろしいですか？`)) {
      try {
        await deleteDeck(deckId);
      } catch (error) {
        console.error('デッキ削除エラー:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-white">デッキ一覧</h2>

        {decks.length === 0 ? (
          <p className="text-white mb-4">保存されたデッキがありません。</p>
        ) : (
          <div className="max-h-80 overflow-y-auto mb-4">
            {decks.map(deck => (
              <div
                key={deck.id}
                className="p-3 bg-gray-700 mb-2 rounded cursor-pointer hover:bg-gray-600 flex items-center"
                onClick={() => handleLoadDeck(deck)}
              >
                <input
                  type="radio"
                  name="mainDeck"
                  className="mr-3 h-4 w-4"
                  checked={mainDeck?.id === deck.id}
                  onChange={() => handleSetMainDeck(deck.id)}
                  onClick={e => e.stopPropagation()}
                />
                <span className="text-white flex-grow">{deck.title}</span>
                <button
                  className="text-red-400 hover:text-red-300 px-2"
                  onClick={e => handleDeleteDeck(deck.id, deck.title, e)}
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <button className="px-4 py-2 bg-gray-600 text-white rounded" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
