'use client';
import { CardDetailWindow } from '@/component/ui/CardDetailWindow';
import { UnitView } from '@/component/ui/UnitView';
import { colorTable } from '@/helper/color';
import { useGame, useWebSocketGame } from '@/hooks/game';
import { MyArea } from '../MyArea';

interface RoomProps {
  id: string
}

export const Game = ({ id }: RoomProps) => {
  void id;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const hooks = useGame()
  useWebSocketGame({ id })

  const mockOpponentData = {
    name: '対戦相手',
    life: 18,
    mana: 7,
    maxMana: 10,
  };

  return (
    <div className={`flex h-screen ${colorTable.ui.background} ${colorTable.ui.text.primary} relative`}>
      {/* カード詳細ウィンドウ */}
      <CardDetailWindow />

      {/* メインゲームコンテナ */}
      <div className="flex flex-col w-full h-full p-4">
        {/* 対戦相手エリア */}
        <div className={`flex-col p-4 border-b ${colorTable.ui.border}`}>
          {/* 対戦相手情報 */}
          <div className={`flex justify-between p-2 ${colorTable.ui.playerInfoBackground} rounded-lg mb-4`}>
            <div className="player-identity">
              <div className="font-bold text-lg">{mockOpponentData.name}</div>
              <div className={`text-sm ${colorTable.ui.text.secondary}`}>オンライン</div>
            </div>
            {/* 対戦相手の手札エリア */}
            <div className="flex justify-center gap-2">
              {/* 対戦相手の手札は裏向きに表示 */}
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={`opponent-card-${i}`}
                  className={`w-8 h-12 ${colorTable.ui.opponentCardBackground} rounded flex justify-center items-center shadow-md ${colorTable.symbols.mana} text-2xl`}
                />
              ))}
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <span className={colorTable.symbols.life}>❤️</span>
                <span>{mockOpponentData.life}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={colorTable.symbols.mana}>💧</span>
                <span>{mockOpponentData.mana}/{mockOpponentData.maxMana}</span>
              </div>
            </div>
          </div>
        </div>

        {/* フィールドエリア */}
        <div className={`flex flex-col p-6 ${colorTable.ui.fieldBackground} rounded-lg my-4`}>
          {/* 対戦相手のフィールド */}
          <div className={`flex justify-center gap-4 pb-4 border-b border-dashed ${colorTable.ui.borderDashed}`}>
            {[1, 2, 3, 4, 5].map((i) => (
              <UnitView image={'/image/card/full/2-3-128.jpg'} color='green' key={i} />
            ))}
          </div>

          {/* 自分のフィールド */}
          <div className="flex justify-center gap-4 pt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <UnitView image={'/image/card/full/2-3-128.jpg'} color='green' key={i} />
            ))}
          </div>
        </div>

        {/* 自分のエリア */}
        <MyArea />

      </div>
    </div>
  );
};
