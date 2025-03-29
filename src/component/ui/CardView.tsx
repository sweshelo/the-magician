import { Atom } from "@/type/game/Card"
import master from "@/service/catalog";
import { getColorCode } from "@/helper/color";

interface Props {
  card: Atom
}

export const CardView = ({ card }: Props) => {
  const catalog = 'catalogId' in card && typeof card.catalogId === 'string' ? master.get(card.catalogId) : undefined;

  return (
    <div
      className={`w-20 h-28 border-2 border-slate-600 rounded flex justify-center items-center text-slate-500 relative`}
      style={{
        // `url(https://coj.sega.jp/player/img/cards/${catalog?.version?.replaceAll(' ', '')}/large_card/card_large_${catalog?.id.toString().padStart(4, '0')}.jpg)`
        backgroundImage: `url('/image/card/full/${catalog?.ref}.jpg')`,
        backgroundSize: 'cover',
      }}
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
    </div>
  )
}