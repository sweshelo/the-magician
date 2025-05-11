'use client';

import { CardDetailWindow } from '@/component/ui/CardDetailWindow';
import { CardView } from '@/component/ui/CardView';
import { colorTable } from '@/helper/color';
import master from '@/submodule/suit/catalog/catalog';
import { ICard, Catalog } from '@/submodule/suit/types';
import { useCallback, useEffect, useMemo, useState, memo, useRef, useLayoutEffect } from 'react';
import { DeckSaveDialog, DeckLoadDialog } from './DeckDialogs';
import { LocalStorageHelper } from '@/service/local-storage';
import { DeckPreview } from './DeckPreview';
import { useSearchParams } from 'next/navigation';

// Memoized Card Component to prevent unnecessary re-renders
const MemoizedCardView = memo(
  ({ card, onClick }: { card: ICard; onClick: () => void }) => {
    return <CardView card={card} isSmall onClick={onClick} />;
  },
  (prevProps, nextProps) => {
    // Only re-render if the card ID changes, not on every parent render
    return prevProps.card.catalogId === nextProps.card.catalogId;
  }
);

// Helper function to get unique values from catalog
const getUniqueValues = <T,>(getter: (catalog: Catalog) => T | T[] | undefined): T[] => {
  const values = new Set<T>();

  master.forEach(catalog => {
    const value = getter(catalog);
    if (Array.isArray(value)) {
      value.forEach(v => v !== undefined && values.add(v));
    } else if (value !== undefined) {
      values.add(value);
    }
  });

  return Array.from(values);
};

// Set display name for the memoized component
MemoizedCardView.displayName = 'MemoizedCardView';

// Filter Control component
const FilterControls = memo(
  ({
    searchQuery,
    setSearchQuery,
    selectedRarities,
    toggleRarity,
    selectedColors,
    toggleColor,
    selectedOriginalities,
    toggleOriginality,
    availableOriginalities,
    selectedVersions,
    toggleVersion,
    availableVersions,
    selectedSpecies,
    toggleSpecies,
    availableSpecies,
    selectedTypes,
    toggleType,
    selectedCosts,
    toggleCost,
    showImplementedOnly,
    setShowImplementedOnly,
  }: {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedRarities: string[];
    toggleRarity: (rarity: string) => void;
    selectedColors: number[];
    toggleColor: (color: number) => void;
    selectedOriginalities: number[];
    toggleOriginality: (originality: number) => void;
    availableOriginalities: number[];
    selectedVersions: number[];
    toggleVersion: (version: number) => void;
    availableVersions: number[];
    selectedSpecies: string[];
    toggleSpecies: (species: string) => void;
    availableSpecies: string[];
    selectedTypes: string[];
    toggleType: (type: string) => void;
    selectedCosts: (number | string)[];
    toggleCost: (cost: number | string) => void;
    showImplementedOnly: boolean;
    setShowImplementedOnly: (v: boolean) => void;
  }) => {
    return (
      <>
        <details className="w-full max-w-6xl p-4">
          <summary className="p-2 border border-2 rounded-lg">フィルタ</summary>
          <div className="w-full max-w-6xl mt-5">
            {/* 効果実装済みのみ表示チェックボックス */}
            <div className="px-4 my-2 flex items-center">
              <input
                id="show-implemented-only"
                type="checkbox"
                className="mr-2"
                checked={showImplementedOnly}
                onChange={e => setShowImplementedOnly(e.target.checked)}
              />
              <label htmlFor="show-implemented-only" className="select-none cursor-pointer">
                効果実装済みのみ表示
              </label>
            </div>
            {/* 検索ボックス */}
            <div className="px-4 my-6">
              <input
                type="text"
                placeholder="カード名や効果テキストで検索"
                className="border-2 border-gray-300 rounded p-2 w-full"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* フィルターコントロール */}
            <div className="px-4 mb-6 flex flex-wrap gap-6">
              {/* レアリティフィルタ */}
              <div className="filter-group">
                <h3 className="font-bold mb-2">レアリティ</h3>
                <div className="flex flex-wrap gap-2">
                  {['c', 'uc', 'r', 'vr', 'sr', 'sp', 'pr'].map(rarity => (
                    <button
                      key={rarity}
                      className={`px-3 py-1 border rounded ${selectedRarities.includes(rarity) ? 'bg-blue-500 text-white' : 'bg-gray-500'}`}
                      onClick={() => toggleRarity(rarity)}
                    >
                      {rarity.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* 属性フィルタ */}
              <div className="filter-group">
                <h3 className="font-bold mb-2">属性</h3>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6].map(color => (
                    <button
                      key={color}
                      className={`px-3 py-1 border rounded ${selectedColors.includes(color) ? 'bg-blue-500 text-white' : 'bg-gray-500'}`}
                      onClick={() => toggleColor(color)}
                    >
                      {color === 1
                        ? '赤'
                        : color === 2
                          ? '黄'
                          : color === 3
                            ? '青'
                            : color === 4
                              ? '緑'
                              : color === 5
                                ? '紫'
                                : '無色'}
                    </button>
                  ))}
                </div>
              </div>

              {/* OP (Originality) フィルタ */}
              <div className="filter-group">
                <h3 className="font-bold mb-2">オリジナリティ</h3>
                <div className="flex flex-wrap gap-2">
                  {availableOriginalities.map(op => (
                    <button
                      key={op}
                      className={`px-3 py-1 border rounded ${selectedOriginalities.includes(op) ? 'bg-blue-500 text-white' : 'bg-gray-500'}`}
                      onClick={() => toggleOriginality(op)}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>

              {/* バージョンフィルタ */}
              <div className="filter-group">
                <h3 className="font-bold mb-2">バージョン</h3>
                <div className="flex flex-wrap gap-2">
                  {availableVersions.map(version => (
                    <button
                      key={version}
                      className={`px-3 py-1 border rounded ${selectedVersions.includes(version) ? 'bg-blue-500 text-white' : 'bg-gray-500'}`}
                      onClick={() => toggleVersion(version)}
                    >
                      {version}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* コストフィルタ */}
            <div className="px-4 mb-6">
              <h3 className="font-bold mb-2">コスト</h3>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3, 4, 5, 6, 7, '7+'].map(cost => (
                  <button
                    key={cost.toString()}
                    className={`px-3 py-1 border rounded ${selectedCosts.includes(cost) ? 'bg-blue-500 text-white' : 'bg-gray-500'}`}
                    onClick={() => toggleCost(cost)}
                  >
                    {cost.toString()}
                  </button>
                ))}
              </div>
            </div>

            {/* 種族フィルタ */}
            <div className="px-4 mb-6">
              <h3 className="font-bold mb-2">種族</h3>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto border p-2 rounded">
                {availableSpecies.map(species => (
                  <button
                    key={species}
                    className={`px-3 py-1 border rounded ${selectedSpecies.includes(species) ? 'bg-blue-500 text-white' : 'bg-gray-500'}`}
                    onClick={() => toggleSpecies(species)}
                  >
                    {species}
                  </button>
                ))}
              </div>
            </div>

            {/* タイプフィルタ */}
            <div className="px-4 mb-6">
              <h3 className="font-bold mb-2">カードタイプ</h3>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto border p-2 rounded">
                {[
                  { name: 'ユニット', value: 'unit' },
                  { name: 'トリガー', value: 'trigger' },
                  { name: 'インターセプト', value: 'intercept' },
                  { name: '進化', value: 'advanced_unit' },
                ].map(type => (
                  <button
                    key={type.value}
                    className={`px-3 py-1 border rounded ${selectedTypes.includes(type.value) ? 'bg-blue-500 text-white' : 'bg-gray-500'}`}
                    onClick={() => toggleType(type.value)}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </details>
      </>
    );
  }
);

// Set display name for the filter controls
FilterControls.displayName = 'FilterControls';

// Deck View component
const DeckView = memo(
  ({ deck, handleCardClick }: { deck: string[]; handleCardClick: (index: number) => void }) => {
    return (
      <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-2 gap-2 justify-items-center m-4">
        {deck.map((catalogId, index) => {
          // Create a stable card object with a consistent ID pattern
          const card: ICard = {
            id: `deck-${catalogId}-${index}`, // Use a stable ID format
            catalogId,
            lv: 1,
          };

          return (
            <div key={`deck-${catalogId}-${index}`}>
              <MemoizedCardView card={card} onClick={() => handleCardClick(index)} />
            </div>
          );
        })}
      </div>
    );
  }
);

// Set display name for the deck view
DeckView.displayName = 'DeckView';

type DeckBuilderProps = {
  implementedIds?: string[];
};

export const DeckBuilder = ({ implementedIds }: DeckBuilderProps) => {
  // Dialog visibility states
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  // DeckView高さ管理
  const [deckViewHeight, setDeckViewHeight] = useState(0);
  const deckViewRef = useRef<HTMLDivElement>(null);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);

  // Deck state
  const [deck, setDeck] = useState<string[]>([
    '1-2-001',
    '1-2-001',
    '1-2-003',
    '1-2-003',
    '1-2-004',
    '1-2-004',
    '1-2-007',
    '1-2-007',
    '1-2-101',
    '1-2-101',
    '1-2-104',
    '1-2-104',
    '1-2-106',
    '1-2-106',
    'PR-028',
    'PR-028',
    '1-2-043',
    '1-2-043',
    '1-2-049',
    '1-2-049',
    '1-2-051',
    '1-2-051',
    '1-2-124',
    'PR-016',
    'PR-016',
    'PR-031',
    'PR-031',
    '1-2-122',
    '1-2-122',
    '1-2-057',
    '1-2-057',
    'PR-032',
    '1-2-078',
    '1-2-141',
    'PR-067',
    '1-2-099',
    '1-2-099',
    '1-2-148',
    '1-2-071',
    '1-2-071',
  ]);

  // DeckView高さを追従
  useLayoutEffect(() => {
    const updateHeight = () => {
      if (deckViewRef.current) {
        setDeckViewHeight(deckViewRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [deck]);

  // Current deck info - if loaded from saved decks
  const [currentDeckTitle, setCurrentDeckTitle] = useState<string | null>(null);
  const [currentDeckId, setCurrentDeckId] = useState<string | null>(null);

  // Card search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [selectedOriginalities, setSelectedOriginalities] = useState<number[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<number[]>([
    6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
  ]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCosts, setSelectedCosts] = useState<(number | string)[]>([]);

  // Available filter options
  const [availableSpecies, setAvailableSpecies] = useState<string[]>([]);
  const [availableOriginalities, setAvailableOriginalities] = useState<number[]>([]);
  const [availableVersions, setAvailableVersions] = useState<number[]>([]);

  // Deck preview state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // 効果実装済みのみ表示フラグ
  const [showImplementedOnly, setShowImplementedOnly] = useState(false);

  // テスト用フラグ
  const searchParams = useSearchParams();
  const limitBreak = Boolean(searchParams.get('limitbreak'));

  // Load available filter options
  useEffect(() => {
    setAvailableSpecies(getUniqueValues(catalog => catalog.species).sort());
    setAvailableOriginalities(
      getUniqueValues(catalog => catalog.originality).sort((a, b) => a - b)
    );
    setAvailableVersions(getUniqueValues(catalog => catalog.info.version).sort((a, b) => a - b));
  }, []);

  // Load main deck on component mount
  useEffect(() => {
    const mainDeck = LocalStorageHelper.getMainDeck();
    if (mainDeck) {
      setDeck(mainDeck.cards);
      setCurrentDeckTitle(mainDeck.title);
      setCurrentDeckId(mainDeck.id);
    }
  }, []);

  const handleCardClick = useCallback((index: number) => {
    setDeck(prev => {
      const newDeck = [...prev];
      newDeck.splice(index, 1);
      return newDeck;
    });
  }, []);

  const addToDeck = useCallback(
    (catalogId: string) => {
      if ((limitBreak || deck.length < 40) && deck.filter(id => id === catalogId).length < 3) {
        setDeck(prevDeck => [...prevDeck, catalogId]);
      }
    },
    [deck, limitBreak]
  );

  // Toggle filter selection - all memoized with useCallback
  const toggleRarity = useCallback((rarity: string) => {
    setSelectedRarities(prev =>
      prev.includes(rarity) ? prev.filter(r => r !== rarity) : [...prev, rarity]
    );
  }, []);

  const toggleColor = useCallback((color: number) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  }, []);

  const toggleSpecies = useCallback((species: string) => {
    setSelectedSpecies(prev =>
      prev.includes(species) ? prev.filter(s => s !== species) : [...prev, species]
    );
  }, []);

  const toggleOriginality = useCallback((originality: number) => {
    setSelectedOriginalities(prev =>
      prev.includes(originality) ? prev.filter(o => o !== originality) : [...prev, originality]
    );
  }, []);

  const toggleVersion = useCallback((version: number) => {
    setSelectedVersions(prev =>
      prev.includes(version) ? prev.filter(v => v !== version) : [...prev, version]
    );
  }, []);

  const toggleType = useCallback((type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }, []);

  const toggleCost = useCallback((cost: number | string) => {
    setSelectedCosts(prev =>
      prev.includes(cost) ? prev.filter(c => c !== cost) : [...prev, cost]
    );
  }, []);

  // Callback for search input changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  // Filtered catalog data
  const filteredCatalogs = useMemo(() => {
    let catalogs = Array.from(master.values()).filter(catalog => {
      // Search query filter
      const matchesSearch =
        searchQuery === '' ||
        catalog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        catalog.ability.toLowerCase().includes(searchQuery.toLowerCase());

      // Rarity filter
      const matchesRarity =
        selectedRarities.length === 0 || selectedRarities.includes(catalog.rarity);

      // Color filter
      const matchesColor = selectedColors.length === 0 || selectedColors.includes(catalog.color);

      // Species filter
      const matchesSpecies =
        selectedSpecies.length === 0 ||
        (catalog.species && catalog.species.some(s => selectedSpecies.includes(s)));

      // Originality filter
      const matchesOriginality =
        selectedOriginalities.length === 0 || selectedOriginalities.includes(catalog.originality);

      // Version filter
      const matchesVersion =
        selectedVersions.length === 0 || selectedVersions.includes(catalog.info.version);

      // Type filter
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(catalog.type);

      // Cost filter
      const matchesCost =
        selectedCosts.length === 0 ||
        selectedCosts.some(cost => {
          if (cost === '7+') {
            return catalog.cost >= 7;
          }
          return catalog.cost === cost;
        });

      return (
        matchesSearch &&
        matchesRarity &&
        matchesColor &&
        matchesSpecies &&
        matchesOriginality &&
        matchesVersion &&
        matchesType &&
        matchesCost
      );
    });

    if (showImplementedOnly && implementedIds && implementedIds.length > 0) {
      catalogs = catalogs.filter(catalog => implementedIds.includes(catalog.id));
    }

    return catalogs;
  }, [
    searchQuery,
    selectedRarities,
    selectedColors,
    selectedSpecies,
    selectedOriginalities,
    selectedVersions,
    selectedTypes,
    selectedCosts,
    showImplementedOnly,
    implementedIds,
  ]);

  // Card List component
  const CardList = memo(
    ({ catalogs, addToDeck }: { catalogs: Catalog[]; addToDeck: (catalogId: string) => void }) => {
      return (
        <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-2 justify-items-center m-4 px-4">
          {catalogs.map(catalog => {
            // Create a stable card object using the catalog ID
            const card: ICard = {
              id: catalog.id, // Use a stable ID instead of randomly generated one
              catalogId: catalog.id,
              lv: 1,
            };

            return (
              <div key={catalog.id}>
                <MemoizedCardView card={card} onClick={() => addToDeck(catalog.id)} />
              </div>
            );
          })}
        </div>
      );
    }
  );

  // Set display name for the card list
  CardList.displayName = 'CardList';

  const handleOpenSaveDialog = useCallback(() => {
    if (deck.length === 40) {
      setSaveDialogOpen(true);
    } else {
      alert('デッキは40枚必要です。');
    }
  }, [deck]);

  const handleSaveDeck = useCallback(
    (title: string, isMainDeck: boolean) => {
      if (deck.length === 40) {
        LocalStorageHelper.saveDeck(title, deck, isMainDeck);
        setCurrentDeckTitle(title);

        // If this is a main deck, remember its ID
        if (isMainDeck) {
          const savedDeck = LocalStorageHelper.getDeckByTitle(title);
          if (savedDeck) {
            setCurrentDeckId(savedDeck.id);
          }
        }

        alert(
          `デッキ「${title}」が保存されました。${isMainDeck ? '（メインデッキに設定されました）' : ''}`
        );
      }
    },
    [deck]
  );

  const sortDeck = useCallback(() => {
    setDeck(prevDeck => {
      // タイプごとにカードを分類
      const typeCategories = ['unit_and_advanced', 'intercept', 'trigger'];
      const cardsByType: Record<string, string[]> = {
        unit_and_advanced: [],
        intercept: [],
        trigger: [],
      };

      // タイプごとに分類
      prevDeck.forEach(catalogId => {
        const catalog = master.get(catalogId);
        if (!catalog) return;

        if (catalog.type === 'unit' || catalog.type === 'advanced_unit') {
          cardsByType.unit_and_advanced.push(catalogId);
        } else if (catalog.type === 'intercept') {
          cardsByType.intercept.push(catalogId);
        } else if (catalog.type === 'trigger') {
          cardsByType.trigger.push(catalogId);
        }
      });

      // 各タイプ内でカラーごとに分類してからソート
      const sortedDeck: string[] = [];

      // 各タイプを処理
      typeCategories.forEach(typeCategory => {
        // カラーごとにグループ化
        const cardsByColor: Record<number, string[]> = {};

        cardsByType[typeCategory].forEach(catalogId => {
          const catalog = master.get(catalogId);
          if (!catalog) return;

          const color = catalog.color;
          if (!cardsByColor[color]) {
            cardsByColor[color] = [];
          }
          cardsByColor[color].push(catalogId);
        });

        // カラー順に並べ替えて、各カラー内でcatalogIdをソート
        Object.keys(cardsByColor)
          .map(Number)
          .sort((a, b) => a - b)
          .forEach(color => {
            const cardsOfColor = cardsByColor[color];
            sortedDeck.push(...cardsOfColor.sort((a, b) => a.localeCompare(b)));
          });
      });

      return sortedDeck;
    });
  }, []);

  const deleteDeck = useCallback(() => {
    setDeck([]);
  }, []);

  const handleLoadDeck = useCallback((cards: string[]) => {
    setDeck(cards);

    // Check if this is the main deck
    const mainDeckId = LocalStorageHelper.getMainDeckId();
    const mainDeck = mainDeckId ? LocalStorageHelper.getDeckById(mainDeckId) : null;

    if (mainDeck && JSON.stringify(mainDeck.cards) === JSON.stringify(cards)) {
      setCurrentDeckTitle(mainDeck.title);
      setCurrentDeckId(mainDeck.id);
    } else {
      setCurrentDeckTitle(null);
      setCurrentDeckId(null);
    }
  }, []);

  return (
    <div className={`w-full flex flex-col justify-center ${colorTable.ui.text.primary}`}>
      <CardDetailWindow />
      <div
        ref={deckViewRef}
        className="w-full flex flex-col items-center justify-center fixed top-0 left-0 right-0 z-10 bg-gray-800 bg-opacity-90 p-4 shadow-lg"
      >
        <DeckView deck={deck} handleCardClick={handleCardClick} />

        <div className="items-center justify-center flex my-2 gap-3">
          <button
            className="px-3 py-1 border rounde text-white rounded bg-blue-500 disabled:bg-indigo-900"
            onClick={handleOpenSaveDialog}
            disabled={deck.length !== 40}
          >
            保存する
          </button>
          <button
            className="px-3 py-1 border rounde text-white rounded bg-gray-500"
            onClick={sortDeck}
          >
            ソート
          </button>
          <button
            className="px-3 py-1 border rounde text-white rounded bg-red-500"
            onClick={deleteDeck}
          >
            デッキをリセット
          </button>
          <button
            className="px-3 py-1 border rounde text-white rounded bg-green-500"
            onClick={() => setLoadDialogOpen(true)}
          >
            デッキ一覧
          </button>
          <button
            className="px-3 py-1 border rounde text-white rounded bg-black-700"
            onClick={() => setIsPreviewOpen(true)}
          >
            プレビュー
          </button>
          {currentDeckTitle && (
            <span className="ml-2 text-gray-300">
              現在のデッキ: {currentDeckTitle}
              {currentDeckId === LocalStorageHelper.getMainDeckId() && (
                <span className="ml-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded">
                  メイン
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Spacer div to push content below the fixed deck view */}
      <div style={{ height: deckViewHeight }}></div>

      <div className="w-full flex flex-col items-center">
        <FilterControls
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
          selectedRarities={selectedRarities}
          toggleRarity={toggleRarity}
          selectedColors={selectedColors}
          toggleColor={toggleColor}
          selectedOriginalities={selectedOriginalities}
          toggleOriginality={toggleOriginality}
          availableOriginalities={availableOriginalities}
          selectedVersions={selectedVersions}
          toggleVersion={toggleVersion}
          availableVersions={availableVersions}
          selectedSpecies={selectedSpecies}
          toggleSpecies={toggleSpecies}
          availableSpecies={availableSpecies}
          selectedTypes={selectedTypes}
          toggleType={toggleType}
          selectedCosts={selectedCosts}
          toggleCost={toggleCost}
          showImplementedOnly={showImplementedOnly}
          setShowImplementedOnly={setShowImplementedOnly}
        />

        <CardList catalogs={filteredCatalogs} addToDeck={addToDeck} />
      </div>
      {/* Deck Management Dialogs */}
      <DeckSaveDialog
        isOpen={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        onSave={handleSaveDeck}
        deck={deck}
      />

      <DeckLoadDialog
        isOpen={loadDialogOpen}
        onClose={() => setLoadDialogOpen(false)}
        onLoad={handleLoadDeck}
      />

      {isPreviewOpen && (
        <DeckPreview
          cards={deck.map((id, index) => ({ id: index.toString(), catalogId: id, lv: 1 }) as ICard)}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
};
