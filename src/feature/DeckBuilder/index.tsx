'use client';

import { CardDetailWindow } from '@/component/ui/CardDetailWindow';
import { CardView } from '@/component/ui/CardView';
import { colorTable } from '@/helper/color';
import master from '@/submodule/suit/catalog/catalog';
import { ICard, Catalog } from '@/submodule/suit/types';
import { useEffect, useMemo, useState } from 'react';

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

export const DeckBuilder = () => {
  // Card search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [selectedOriginalities, setSelectedOriginalities] = useState<number[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<number[]>([]);

  // Available filter options
  const [availableSpecies, setAvailableSpecies] = useState<string[]>([]);
  const [availableOriginalities, setAvailableOriginalities] = useState<number[]>([]);
  const [availableVersions, setAvailableVersions] = useState<number[]>([]);

  // Load available filter options
  useEffect(() => {
    setAvailableSpecies(getUniqueValues(catalog => catalog.species).sort());
    setAvailableOriginalities(
      getUniqueValues(catalog => catalog.originality).sort((a, b) => a - b)
    );
    setAvailableVersions(getUniqueValues(catalog => catalog.info.version).sort((a, b) => a - b));
  }, []);

  // Deck state
  const [deck, setDeck] = useState<string[]>([
    '2-2-060',
    '2-2-060',
    '2-2-060',
    '2-0-008',
    '2-0-008',
    '2-0-008',
    '1-4-246',
    '1-4-008',
    '1-4-008',
    '1-4-008',
    '2-3-011',
    '2-3-011',
    '2-3-011',
    '1-4-041',
    '1-4-041',
    '1-4-041',
    '2-0-025',
    '2-0-025',
    '2-0-025',
    '2-0-121',
    '2-0-121',
    '2-0-121',
    'SP-012',
    'SP-012',
    'SP-012',
    '2-1-051',
    '2-1-051',
    '2-1-051',
    '2-0-038',
    '2-0-038',
    '2-0-038',
    '2-0-007',
    '2-0-007',
    '2-0-007',
    '2-0-019',
    '2-0-019',
    '2-0-019',
    'SP-016',
    'SP-016',
    'SP-016',
    'SP-005',
    'SP-005',
    'SP-005',
    'SP-031',
    'SP-031',
    'SP-031',
    '2-3-240',
  ]);

  const handleCardClick = (index: number) => {
    const newDeck = [...deck];
    newDeck.splice(index, 1);
    setDeck(newDeck);
  };

  const addToDeck = (catalogId: string) => {
    if (deck.length < 40) {
      setDeck(prevDeck => [...prevDeck, catalogId]);
    }
  };

  // Toggle filter selection
  const toggleRarity = (rarity: string) => {
    setSelectedRarities(prev =>
      prev.includes(rarity) ? prev.filter(r => r !== rarity) : [...prev, rarity]
    );
  };

  const toggleColor = (color: number) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const toggleSpecies = (species: string) => {
    setSelectedSpecies(prev =>
      prev.includes(species) ? prev.filter(s => s !== species) : [...prev, species]
    );
  };

  const toggleOriginality = (originality: number) => {
    setSelectedOriginalities(prev =>
      prev.includes(originality) ? prev.filter(o => o !== originality) : [...prev, originality]
    );
  };

  const toggleVersion = (version: number) => {
    setSelectedVersions(prev =>
      prev.includes(version) ? prev.filter(v => v !== version) : [...prev, version]
    );
  };

  // Filtered catalog data
  const filteredCatalogs = useMemo(() => {
    return Array.from(master.values()).filter(catalog => {
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

      return (
        matchesSearch &&
        matchesRarity &&
        matchesColor &&
        matchesSpecies &&
        matchesOriginality &&
        matchesVersion
      );
    });
  }, [
    searchQuery,
    selectedRarities,
    selectedColors,
    selectedSpecies,
    selectedOriginalities,
    selectedVersions,
  ]);

  return (
    <div className={`w-full flex flex-col justify-center  ${colorTable.ui.text.primary}`}>
      <CardDetailWindow />
      <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-2 gap-2 justify-items-center m-4">
        {deck.map((catalogId, index) => {
          const card = {
            id: crypto.randomUUID(),
            catalogId,
            lv: 1,
          } as ICard;

          return (
            <div key={card.id}>
              <CardView card={card} isSmall onClick={() => handleCardClick(index)} />
            </div>
          );
        })}
      </div>

      <div className="w-full flex flex-col items-center">
        {/* 検索ボックス */}
        <div className="w-full max-w-6xl px-4 mb-6">
          <input
            type="text"
            placeholder="カード名や効果テキストで検索"
            className="border-2 border-gray-300 rounded p-2 w-full"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* フィルターコントロール */}
        <div className="w-full max-w-6xl px-4 mb-6 flex flex-wrap gap-6">
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

        {/* 種族フィルタ */}
        <div className="w-full max-w-6xl px-4 mb-6">
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

        <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-2 justify-items-center m-4 px-4">
          {/* フィルタリングされたカードリスト */}
          {filteredCatalogs.map(catalog => {
            const card = {
              id: crypto.randomUUID(),
              catalogId: catalog.id,
              lv: 1,
            } as ICard;

            return (
              <div key={card.id}>
                <CardView card={card} isSmall onClick={() => addToDeck(catalog.id)} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
