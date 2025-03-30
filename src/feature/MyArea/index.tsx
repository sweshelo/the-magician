import { CPView } from "@/component/ui/CPView"
import { CardsCountView } from "@/component/ui/CardsCountView"
import { LifeView } from "@/component/ui/LifeView"
import { colorTable } from "@/helper/color"
import { useGame } from "@/hooks/game"
import { HandArea } from "../Hand"
import { GiCardDraw } from "react-icons/gi"

export const MyArea = () => {
  const { self } = useGame()

  return (
    <div className="flex-col p-4 min-h-[250px]">
      {/* 自分の情報 */}
      <div className={`flex justify-between items-center p-2 ${colorTable.ui.playerInfoBackground} rounded-lg mb-4`}>
        <div className="player-identity">
          <div className="font-bold text-lg">{self?.status.name || ''}</div>
          <div className={`text-sm ${colorTable.ui.text.secondary}`}>あなたのターン</div>
        </div>

        <div className="flex gap-4">
          {self?.deck && (
            <CardsCountView count={self.deck.length}>
              <GiCardDraw color="cyan" size={40} />
            </CardsCountView>
          )}
          {self?.trash && (
            <CardsCountView count={self.trash.length}>
              <GiCardDraw color="yellowgreen" size={40} />
            </CardsCountView>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {self?.status.life && (
            <LifeView current={self.status.life.current} max={self.status.life.max} />
          )}
          {self?.status.cp && (
            <CPView current={self.status.cp.current} max={self.status.cp.max} />
          )}
        </div>
      </div>

      {/* 自分の手札エリア */}
      <HandArea hand={self.hand} />
    </div>
  )
}
