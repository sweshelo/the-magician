import master from "@/submodule/suit/catalog/catalog";
import { getColorCode } from "@/helper/color";
import { IAtom, ICard } from "@/submodule/suit/types";

interface Props {
  card: IAtom
  isSelecting?: boolean
  isHighlighting?: boolean
  onClick?: () => void
}

// Type guard to check if an IAtom is actually an ICard
function isICard(card: IAtom): card is ICard {
  return 'catalogId' in card && typeof card.catalogId === 'string' && 'lv' in card && typeof card.lv === 'number';
}

export const CardView = ({ card, isSelecting, isHighlighting, onClick }: Props) => {
  // Use the type guard to check if this is an ICard
  const cardAsICard = isICard(card) ? card : null;
  const catalog = cardAsICard ? master.get(cardAsICard.catalogId) : undefined;

  return (
    <div
      className={`w-28 h-39 border-2 border-slate-600 rounded justify-center items-center text-slate-500 relative ${isSelecting ? 'animate-pulse-border' : ''}`}
      style={{
        backgroundImage: `url('https://coj.sega.jp/player/img/${catalog?.img}')`,
        backgroundSize: 'cover',
      }}
      onClick={onClick}
    >
      <div
        className={`w-full h-full rounded flex flex-col text-xs shadow-lg relative cursor-pointer`}
      >
        <div className="flex justify-between mb-1">
          <div className="border-3 border-gray-700">
            {catalog && (
              <div className={`w-5 h-5 flex items-center justify-center font-bold text-white ${catalog ? getColorCode(catalog.color) : ''}`}>
                {catalog?.cost}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="border-gray-700 absolute bottom-0 w-full">
        {catalog && (
          <ul className={`w-full h-7 flex items-center justify-center font-bold text-white bg-gray-700`}>
            {cardAsICard && <li className="text-xs">{`Lv ${cardAsICard.lv}`}</li>}
            {catalog.bp && <li className="ml-2">{catalog.bp?.[(cardAsICard?.lv ?? 1) - 1]}</li>}
          </ul>
        )}
      </div>
      {isHighlighting && (
        <div className="absolute inset-0 border-1 border-gray-300 animate-pulse-border shadow-glow pointer-events-none" />
      )}
    </div>
  )
}
