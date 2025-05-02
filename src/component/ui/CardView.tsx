import master from '@/submodule/suit/catalog/catalog';
import { getColorCode } from '@/helper/color';
import { IAtom, ICard } from '@/submodule/suit/types';
import { useSystemContext } from '@/hooks/system/hooks';
import { useCallback } from 'react';

interface Props {
  card: IAtom;
  isSelecting?: boolean;
  isHighlighting?: boolean;
  onClick?: () => void;
  isSmall?: boolean;
  isMitigated?: boolean;
}

// Type guard to check if an IAtom is actually an ICard
function isICard(card: IAtom): card is ICard {
  return (
    'catalogId' in card &&
    typeof card.catalogId === 'string' &&
    'lv' in card &&
    typeof card.lv === 'number'
  );
}

export const CardView = ({
  card,
  isSelecting,
  isHighlighting,
  isSmall,
  isMitigated = false,
  onClick,
}: Props) => {
  // Use the type guard to check if this is an ICard
  const cardAsICard = isICard(card) ? card : null;
  const catalog = cardAsICard ? master.get(cardAsICard.catalogId) : undefined;

  const sizeClass = isSmall ? 'w-19 h-26' : 'w-28 h-39';

  const { setSelectedCard } = useSystemContext();
  const handleCardClick = useCallback(() => {
    if (isICard(card))
      setSelectedCard(prev => (prev?.catalogId === card.catalogId ? undefined : card));
  }, [card, setSelectedCard]);

  return (
    <div
      className={`${sizeClass} border-2 border-slate-600 rounded justify-center items-center text-slate-500 relative ${isSelecting ? 'animate-pulse-border' : ''}`}
      style={{
        backgroundImage: `url('https://coj.sega.jp/player/img/${catalog?.img}')`,
        backgroundSize: 'cover',
      }}
      onClick={() => {
        handleCardClick();
        onClick?.();
      }}
    >
      <div
        className={`w-full h-full rounded flex flex-col text-xs shadow-lg relative cursor-pointer`}
      >
        <div className="flex justify-between mb-1">
          <div className="border-3 border-gray-700">
            {catalog && (
              <div
                className={`w-5 h-5 flex items-center justify-center font-bold text-white ${catalog ? getColorCode(catalog.color) : ''}`}
              >
                {(catalog?.cost ?? 0) - (isMitigated ? 1 : 0)}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="border-gray-700 absolute bottom-0 w-full">
        {catalog && (
          <ul
            className={`w-full h-7 flex items-center justify-center font-bold text-white bg-gray-700`}
          >
            {cardAsICard && <li className="text-xs">{`Lv ${cardAsICard.lv}`}</li>}
            {catalog.bp && <li className="ml-2">{catalog.bp?.[(cardAsICard?.lv ?? 1) - 1]}</li>}
          </ul>
        )}
      </div>
      {isHighlighting && (
        <div className="absolute inset-0 border-1 border-gray-300 animate-pulse-border shadow-glow pointer-events-none" />
      )}

      {/* Deleted card indicators */}
      {'deleted' in card && typeof card.deleted === 'boolean' && card.deleted && (
        <>
          {/* First diagonal line */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: 0,
              right: 0,
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 15,
                width: '192px',
                height: '3px',
                backgroundColor: 'navy',
                transformOrigin: 'top right',
                transform: 'rotate(-55deg)',
              }}
            />
          </div>

          {/* Second diagonal line */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: 0,
              right: 0,
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: -7,
                width: '192px',
                height: '3px',
                backgroundColor: 'navy',
                transformOrigin: 'top right',
                transform: 'rotate(-55deg)',
              }}
            />
          </div>

          {/* Central DELETE box */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              style={{
                width: '100%',
                padding: '6px 0',
                backgroundColor: 'navy',
                color: 'white',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                letterSpacing: '1px',
              }}
            >
              DELETE
            </div>
          </div>
        </>
      )}
    </div>
  );
};
