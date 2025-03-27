import { CardView } from "@/component/ui/CardView"
import { CPView } from "@/component/ui/CPView"
import { DeckCountView } from "@/component/ui/DeckCountView"
import { LifeView } from "@/component/ui/LifeView"
import { colorTable } from "@/helper/color"
import { useGame } from "@/hooks/game"
import { LocalStorageHelper } from "@/service/local-storage"
import { IPlayer } from "@/submodule/suit/types"
import { useMemo } from "react"

export const MyArea = () => {
  const { players } = useGame()
  const selfPlayerId = LocalStorageHelper.playerId()
  const self = useMemo<IPlayer | undefined>(() => players?.[selfPlayerId], [players, selfPlayerId])

  return (
    <div className="flex-col p-4 min-h-[250px]">
      {/* 自分の情報 */}
      <div className={`flex justify-between items-center p-2 ${colorTable.ui.playerInfoBackground} rounded-lg mb-4`}>
        <div className="player-identity">
          <div className="font-bold text-lg">{self?.name || ''}</div>
          <div className={`text-sm ${colorTable.ui.text.secondary}`}>あなたのターン</div>
        </div>

        {self?.deck && (
          <DeckCountView count={self.deck.length} />
        )}

        <div className="flex flex-col gap-2">
          {self?.life && (
            <LifeView current={self.life.current} max={self.life.max} />
          )}
          {self?.cp && (
            <CPView current={self.cp.current} max={self.cp.max} />
          )}
        </div>
      </div>

      {/* 自分の手札エリア */}
      <div className="flex justify-center gap-2 p-4 min-h-[120px]">
        {self?.hand?.map((card, index) => (
          <CardView key={`hand-card-${index}`} card={card} />
        ))}
      </div>
    </div>
  )
}
