import { useGame } from "@/hooks/game/hooks"
import master from "@/service/catalog";
import classNames from "classnames";
import Image from "next/image";
import { CostView } from "./CostView";
import { colorTable } from "@/helper/color";

interface LevelProps {
  lv: number;
  bp?: number;
  active?: boolean;
}
export const Level = ({ bp, lv, active }: LevelProps) => {
  return (
    <div className={classNames("flex rounded h-6 flex-1 items-center justify-center text-xs font-bold mr-1 px-4", {
      'bg-red-700': active,
      'bg-slate-600': !active,
    })}>
      <div className="flex-1">Lv.{lv}</div>
      <div className="flex-1 text-right text-xl">{bp}</div>
    </div>
  )
}

export const CardDetailWindow = () => {
  const { selectedCard, setSelectedCard } = useGame();
  const catalog = selectedCard?.catalogId && master.get(selectedCard?.catalogId)

  return (
    selectedCard && catalog && (
      <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-128 ${colorTable.ui.playerInfoBackground} rounded-lg shadow-lg z-10 border ${colorTable.ui.border} overflow-hidden`}>
        {/* ウィンドウヘッダー */}
        <div className={`flex justify-between items-center p-3 ${colorTable.ui.background}`}>
          <h3 className="font-bold">{catalog.name}</h3>
          <button
            onClick={() => setSelectedCard(undefined)}
            className={`${colorTable.ui.text.secondary} hover:${colorTable.ui.text.primary}`}
          >
            ✕
          </button>
        </div>

        {/* カード情報 */}
        <div className="p-4">
          {/* カード名と属性 */}
          <div className="flex gap-3 items-center mb-3">
            <CostView color={catalog.color} value={catalog.cost} side={25}/>
            <Image className="border-2 border-gray-700 shadow" src={'/image/card/info/1-0-001.png'} width={150} height={72} alt={catalog.name} />
          </div>

          {/* 効果 */}
          <div className="mb-3">
            <p className={`text-sm ${colorTable.ui.background} p-2 rounded whitespace-pre-wrap`}>{catalog.text}</p>
          </div>

          {/* BP */}
          <div className="justify-between mb-4">
            <div className="flex flex-row items-center">
              <Level lv={1} bp={catalog.bp && catalog.bp[0]} active={true} />
              <Level lv={2} bp={catalog.bp && catalog.bp[1]} />
              <Level lv={3} bp={catalog.bp && catalog.bp[2]} />
            </div>
          </div>
        </div>
      </div>
    )
  )
}
