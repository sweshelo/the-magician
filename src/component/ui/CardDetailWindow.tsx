'use client';

import master from '@/submodule/suit/catalog/catalog';
import classNames from 'classnames';
import { colorTable, getColorCode } from '@/helper/color';
import Image from 'next/image';
import { useSystemContext } from '@/hooks/system/hooks';
import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';

interface LevelProps {
  lv: number;
  bp?: number;
  active?: boolean;
}
export const Level = ({ bp, lv, active }: LevelProps) => {
  return (
    <div
      className={classNames(
        'flex rounded h-6 flex-1 items-center justify-center text-xs font-bold mr-1 px-4',
        {
          'bg-red-700': active,
          'bg-slate-600': !active,
        }
      )}
    >
      <div className="flex-1">Lv.{lv}</div>
      <div className="flex-1 text-right text-xl">{bp}</div>
    </div>
  );
};

export const CardDetailWindow = () => {
  const { detailCard, setDetailCard, detailPosition } = useSystemContext();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Handle mouse events for dragging
  const handleMouseDown = (e: MouseEvent) => {
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    },
    [isDragging, dragOffset]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Only set the initial position once when component mounts or when card changes but position hasn't been set yet
  useEffect(() => {
    // Initialize position only if it hasn't been set yet (x and y are both 0)
    if (position.x === 0 && position.y === 0) {
      setPosition(detailPosition);
    }
  }, [detailPosition, position.x, position.y]);

  // Add and remove global event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove as unknown as EventListener);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove as unknown as EventListener);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // If no card is selected, don't render anything
  if (!detailCard) return null;

  const catalog = detailCard?.catalogId && master.get(detailCard.catalogId);

  const cardType = {
    unit: 'ユニットカード',
    advanced_unit: '進化カード',
    trigger: 'トリガーカード',
    intercept: 'インターセプトカード',
  };

  return (
    catalog && (
      <div
        ref={windowRef}
        className={`fixed transform w-100 ${colorTable.ui.playerInfoBackground} rounded-lg shadow-lg z-50 border ${colorTable.ui.border} overflow-hidden cursor-move`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          minWidth: '400px',
          maxWidth: '500px',
        }}
      >
        {/* ウィンドウヘッダー */}
        <div
          className={`flex justify-between items-center p-3 h-20 ${colorTable.ui.background}`}
          style={{
            backgroundImage: `url(https://coj.sega.jp/player/img/${catalog.img})`,
            backgroundSize: 'cover',
            backgroundPosition: '0% -140px',
          }}
        >
          <div className="rounded-sm border-3 border-gray">
            <div
              className={`w-6 h-6 flex items-center justify-center font-bold ${getColorCode(catalog.color)}`}
            >
              {catalog.cost}
            </div>
          </div>
          <h3 className="font-bold bg-black/50 px-6 py-2 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <span className="mr-2">{catalog.name}</span>
              <Image
                src={`https://coj.sega.jp/player/images/common/card/r_${catalog.rarity}.png`}
                alt={catalog.rarity}
                width={32}
                height={32}
              />
            </div>
            <span className="text-xs mt-1">{`${cardType[catalog.type]} - ${catalog.id}`}</span>
          </h3>
          <button
            onClick={() => setDetailCard(undefined)}
            className={`${colorTable.ui.text.secondary} hover:${colorTable.ui.text.primary} cursor-pointer`}
          >
            ✕
          </button>
        </div>

        {/* カード情報 */}
        <div className="p-4" onMouseDown={handleMouseDown}>
          {/* 効果 */}
          <div className="mb-3">
            <p className={`text-sm rounded whitespace-pre-wrap min-h-40`}>{catalog.ability}</p>
          </div>

          {/* BP */}
          <div className="justify-between">
            <div className="flex flex-row items-center">
              <Level lv={1} bp={catalog.bp && catalog.bp[0]} active={true} />
              <Level lv={2} bp={catalog.bp && catalog.bp[1]} />
              <Level lv={3} bp={catalog.bp && catalog.bp[2]} />
            </div>
          </div>
        </div>
      </div>
    )
  );
};
