import { Atom, Card } from "@/type/game/Card"
import master from "@/service/catalog";
import { useSystemContext } from "@/hooks/system/hooks";
import { getColorCode } from "@/helper/color";

interface Props {
  card: Atom
}

export const CardView = ({ card }: Props) => {
  const catalog = 'catalogId' in card && typeof card.catalogId === 'string' ? master.get(card.catalogId) : undefined;
  const { setSelectedCard } = useSystemContext();
  const handleCardClick = () => {
    if (catalog) setSelectedCard(card as Card)
  }

  return (
    <div
      className={`w-20 h-28 border-2 border-slate-600 rounded flex justify-center items-center text-slate-500`}
      style={{
        backgroundImage: `url('/image/card/full/${catalog?.id}.jpg')`,
        backgroundSize: 'cover',
      }}
    >
      <div
        className={`w-full h-full rounded flex flex-col text-xs shadow-lg relative cursor-pointer`}
        onClick={handleCardClick}
      >
        <div className="flex justify-between mb-1">
          <div className="border-3 border-gray-700">
            <div className={`w-5 h-5 flex items-center justify-center font-bold text-white ${catalog ? getColorCode(catalog.color) : ''}`}>
              {catalog?.cost}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}