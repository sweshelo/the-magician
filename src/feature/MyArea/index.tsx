import { CardView } from "@/component/ui/CardView"
import { colorTable } from "@/helper/color"

export const MyArea = () => {
  return (
    <div className="flex-col p-4">
      {/* 自分の情報 */}
      <div className={`flex justify-between p-2 ${colorTable.ui.playerInfoBackground} rounded-lg mb-4`}>
        <div className="player-identity">
          <div className="font-bold text-lg">{''}</div>
          <div className={`text-sm ${colorTable.ui.text.secondary}`}>あなたのターン</div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <span className={colorTable.symbols.life}>❤️</span>
            <span>{0}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={colorTable.symbols.mana}>💧</span>
            <span>{0}/{0}</span>
          </div>
        </div>
      </div>

      {/* 自分の手札エリア */}
      <div className="flex justify-center gap-2 p-4">
        {/* 自分の手札は表向きに表示 */}
      </div>
    </div>
  )
}