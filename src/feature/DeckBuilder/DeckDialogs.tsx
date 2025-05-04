'use client';

import { DeckData, LocalStorageHelper } from '@/service/local-storage';
import { useState, useEffect } from 'react';

interface DeckSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, isMainDeck: boolean) => void;
  deck: string[];
}

interface DeckListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (cards: string[]) => void;
}

export const DeckSaveDialog = ({ isOpen, onClose, onSave, deck }: DeckSaveDialogProps) => {
  const [title, setTitle] = useState('');
  const [savedDecks, setSavedDecks] = useState<DeckData[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [saveMode, setSaveMode] = useState<'new' | 'overwrite'>('new');
  const [isMainDeck, setIsMainDeck] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load saved decks when dialog opens
      setSavedDecks(LocalStorageHelper.getAllDecks());
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
              disabled={savedDecks.length === 0}
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
                {savedDecks.map(deck => (
                  <div
                    key={deck.title}
                    className={`p-2 cursor-pointer hover:bg-gray-600 ${
                      selectedDeck === deck.title ? 'bg-blue-500' : ''
                    }`}
                    onClick={() => handleDeckSelect(deck.title)}
                  >
                    <span className="text-white">{deck.title}</span>
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

        <div className="flex justify-end gap-2">
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
  const [savedDecks, setSavedDecks] = useState<DeckData[]>([]);
  const [mainDeckId, setMainDeckId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Load saved decks when dialog opens
      setSavedDecks(LocalStorageHelper.getAllDecks());
      setMainDeckId(LocalStorageHelper.getMainDeckId());
    }
  }, [isOpen]);

  const handleLoadDeck = (deck: DeckData) => {
    onLoad(deck.cards);
    onClose();
  };

  const handleSetMainDeck = (deckId: string) => {
    LocalStorageHelper.setMainDeckId(deckId);
    setMainDeckId(deckId);
  };

  const handleDeleteDeck = (title: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm(`「${title}」を削除してもよろしいですか？`)) {
      LocalStorageHelper.deleteDeck(title);
      setSavedDecks(LocalStorageHelper.getAllDecks());
      setMainDeckId(LocalStorageHelper.getMainDeckId());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-white">デッキ一覧</h2>

        {savedDecks.length === 0 ? (
          <p className="text-white mb-4">保存されたデッキがありません。</p>
        ) : (
          <div className="max-h-80 overflow-y-auto mb-4">
            {savedDecks.map(deck => (
              <div
                key={deck.title}
                className="p-3 bg-gray-700 mb-2 rounded cursor-pointer hover:bg-gray-600 flex items-center"
                onClick={() => handleLoadDeck(deck)}
              >
                <input
                  type="radio"
                  name="mainDeck"
                  className="mr-3 h-4 w-4"
                  checked={mainDeckId === deck.id}
                  onChange={() => handleSetMainDeck(deck.id)}
                  onClick={e => e.stopPropagation()}
                />
                <span className="text-white flex-grow">{deck.title}</span>
                <button
                  className="text-red-400 hover:text-red-300 px-2"
                  onClick={e => handleDeleteDeck(deck.title, e)}
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
