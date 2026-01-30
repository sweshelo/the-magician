'use client';

import { CardView } from '@/component/ui/CardView';
import { ICard, Catalog } from '@/submodule/suit/types';
import { memo, useRef, useState, useEffect, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

// Memoized Card Component
const MemoizedCardView = memo(
  ({ card, onClick }: { card: ICard; onClick: () => void }) => {
    return <CardView card={card} isSmall onClick={onClick} />;
  },
  (prevProps, nextProps) => {
    return prevProps.card.catalogId === nextProps.card.catalogId;
  }
);

MemoizedCardView.displayName = 'MemoizedCardView';

// Card dimensions
const CARD_WIDTH = 76;
const CARD_HEIGHT = 104;
const GAP = 4;

interface VirtualCardListProps {
  catalogs: Catalog[];
  addToDeck: (catalogId: string) => void;
}

export const VirtualCardList = memo(({ catalogs, addToDeck }: VirtualCardListProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Monitor container width with ResizeObserver
  useEffect(() => {
    const container = parentRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Calculate columns based on container width
  const columns = Math.max(1, Math.floor((containerWidth + GAP) / (CARD_WIDTH + GAP)));

  // Calculate row count
  const rowCount = Math.ceil(catalogs.length / columns);

  // Virtual row height
  const rowHeight = CARD_HEIGHT + GAP;

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 5,
  });

  // Get card for a specific index
  const getCard = useCallback(
    (index: number): { catalog: Catalog; card: ICard } | null => {
      if (index >= catalogs.length) return null;
      const catalog = catalogs[index];
      return {
        catalog,
        card: {
          id: catalog.id,
          catalogId: catalog.id,
          lv: 1,
        },
      };
    },
    [catalogs]
  );

  return (
    <div
      ref={parentRef}
      className="overflow-auto w-full max-w-[1600px] mx-4 px-4"
      style={{ height: '100%' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map(virtualRow => {
          const startIndex = virtualRow.index * columns;

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div
                className="grid justify-items-center"
                style={{
                  gridTemplateColumns: `repeat(${columns}, minmax(72px, 1fr))`,
                  gap: `${GAP}px`,
                }}
              >
                {Array.from({ length: columns }).map((_, colIndex) => {
                  const itemIndex = startIndex + colIndex;
                  const item = getCard(itemIndex);

                  if (!item) {
                    return <div key={`empty-${colIndex}`} />;
                  }

                  return (
                    <div key={item.catalog.id}>
                      <MemoizedCardView
                        card={item.card}
                        onClick={() => addToDeck(item.catalog.id)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

VirtualCardList.displayName = 'VirtualCardList';
