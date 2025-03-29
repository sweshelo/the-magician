import master from "@/service/catalog";
import { getColorCode } from "@/helper/color";
import { ICard } from "@/submodule/suit/types";

interface Props {
  card: ICard
}

export const CardView = ({ card }: Props) => {
  const catalog = 'catalogId' in card && typeof card.catalogId === 'string' ? master.get(card.catalogId) : undefined;

  return (
    <div
      className={`w-28 h-39 border-2 border-slate-600 rounded justify-center items-center text-slate-500 relative`}
      style={{
        backgroundImage: `url('https://coj.sega.jp/player/img/${catalog?.img}')`,
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
      <div className="border-gray-700 absolute bottom-0 w-full">
        {catalog && (
          <ul className={`w-full h-7 flex items-center justify-center font-bold text-white bg-gray-700`}>
            <li className="text-xs">Lv 1</li>
            {catalog.bp && <li className="ml-2">{catalog.bp?.[0]}</li>}
          </ul>
        )}
      </div>
    </div>
  )
}