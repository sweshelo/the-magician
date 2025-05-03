'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import keywordsData from '../../submodule/suit/catalog/keywords.json';

interface KeywordEffect {
  count: number;
  effect: {
    type: string;
    name: string;
  };
}

interface BattleIconsViewProps {
  delta?: unknown; // Use unknown instead of any for type safety
}

const BattleIconsViewComponent = ({ delta }: BattleIconsViewProps) => {
  // Safely handle delta as any type
  const deltaArray = Array.isArray(delta) ? delta : [];
  const [currentPage, setCurrentPage] = useState(0);

  // Filter for keyword effects, handling potential undefined properties safely
  const keywordEffects: KeywordEffect[] =
    deltaArray.filter(item => item?.effect?.type === 'keyword') || [];
  const totalPages = Math.ceil(keywordEffects.length / 5);

  // Use useEffect to cycle through pages every second if there are more than 5 icons
  useEffect(() => {
    if (totalPages <= 1) return;

    const checkAndUpdatePage = () => {
      // Use Date to synchronize across all components
      const currentSecond = Math.floor(Date.now() / 1000);
      setCurrentPage(currentSecond % totalPages);
    };

    // Set initial page
    checkAndUpdatePage();

    // Check every 100ms to catch the second change
    const intervalId = setInterval(checkAndUpdatePage, 100);

    return () => clearInterval(intervalId);
  }, [totalPages]);

  // If no keyword effects, don't render anything
  if (keywordEffects.length === 0) return null;

  // Get current icons to display
  const displayIcons = keywordEffects.slice(currentPage * 5, currentPage * 5 + 5);

  return (
    <div className="relative flex justify-center w-32 h-6 mb-1">
      <div className="flex flex-row justify-start items-center w-[120px]">
        {displayIcons.map((item, index) => (
          <Image
            key={index}
            src={
              keywordsData.find(k => k.title === item.effect.name)?.['no-image']
                ? '/image/icon/no-image.png'
                : `/image/icon/${item.effect.name}.png`
            }
            alt={item.effect.name}
            width={24}
            height={24}
            className="inline-block"
            data-tooltip-id={`keyword-tooltip-${item.effect.name}`}
          />
        ))}
      </div>

      {/* Add tooltips for each icon */}
      {displayIcons.map(item => {
        const keyword = keywordsData.find(k => k.title === item.effect.name);
        console.log(keyword);
        return (
          <Tooltip
            key={`tooltip-${item.effect.name}`}
            id={`keyword-tooltip-${item.effect.name}`}
            place="top"
            className="z-50 max-w-xs"
          >
            {keyword ? <BattleIconDetail name={keyword.title} /> : item.effect.name}
          </Tooltip>
        );
      })}
    </div>
  );
};

export const BattleIconDetail = ({ name }: { name: string }) => {
  const keyword = keywordsData.find(k => k.title === name);
  if (keyword === undefined) return null;

  return (
    <div className="p-1">
      <div className="flex items-center mb-1">
        <Image
          src={
            keyword['no-image'] ? '/image/icon/no-image.png' : `/image/icon/${keyword.title}.png`
          }
          alt=""
          width={24}
          height={24}
          className="inline-block mr-2"
        />
        <div className="font-bold text-lg">{keyword.title}</div>
      </div>
      {keyword.text && <div className="italic">&quot;{keyword.text}&quot;</div>}
      <div className="border-t-1 py-1 my-1">{keyword.description}</div>
    </div>
  );
};

export const BattleIconsView = React.memo(BattleIconsViewComponent);
