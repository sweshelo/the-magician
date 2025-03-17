'use client';
import { CardDetailWindow } from './CardDetailWindow';
import { Card } from '@/type/game/Card';
import { CardView } from './CardView';

export const Game = () => {
  // モックデータ
  const mockPlayerData = {
    name: '自分',
    life: 20,
    mana: 5,
    maxMana: 10,
  };

  const mockOpponentData = {
    name: '対戦相手',
    life: 18,
    mana: 7,
    maxMana: 10,
  };

  const mockCard: Card = {
    id: crypto.randomUUID(),
    catalogId: '2-3-128',
  }

  return (
    <div className="flex h-screen bg-slate-900 text-white relative">
      {/* カード詳細ウィンドウ */}
      <CardDetailWindow />

      {/* メインゲームコンテナ */}
      <div className="flex flex-col w-full h-full p-4">
        {/* 対戦相手エリア */}
        <div className="flex-1 flex flex-col p-4 border-b border-slate-700">
          {/* 対戦相手情報 */}
          <div className="flex justify-between p-2 bg-slate-800/70 rounded-lg mb-4">
            <div className="player-identity">
              <div className="font-bold text-lg">{mockOpponentData.name}</div>
              <div className="text-sm text-slate-400">オンライン</div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <span className="text-red-400">❤️</span>
                <span>{mockOpponentData.life}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-blue-400">💧</span>
                <span>{mockOpponentData.mana}/{mockOpponentData.maxMana}</span>
              </div>
            </div>
          </div>

          {/* 対戦相手の手札エリア */}
          <div className="flex justify-center gap-2 p-4">
            {/* 対戦相手の手札は裏向きに表示 */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={`opponent-card-${i}`}
                className="w-16 h-24 bg-slate-800 rounded flex justify-center items-center shadow-md text-blue-400 text-2xl"
              >
                ✦
              </div>
            ))}
          </div>
        </div>

        {/* フィールドエリア */}
        <div className="flex flex-col p-6 bg-slate-800/40 rounded-lg my-4">
          {/* 対戦相手のフィールド */}
          <div className="flex justify-center gap-4 mb-6 pb-4 border-b border-dashed border-slate-600">
            {[1, 2, 3, 4, 5].map((i) => (
              <CardView card={mockCard} key={i}/>
            ))}
          </div>

          {/* 自分のフィールド */}
          <div className="flex justify-center gap-4 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <CardView card={mockCard} key={i}/>
            ))}
          </div>
        </div>

        {/* 自分のエリア */}
        <div className="flex-1 flex flex-col p-4">
          {/* 自分の情報 */}
          <div className="flex justify-between p-2 bg-slate-800/70 rounded-lg mb-4">
            <div className="player-identity">
              <div className="font-bold text-lg">{mockPlayerData.name}</div>
              <div className="text-sm text-slate-400">あなたのターン</div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <span className="text-red-400">❤️</span>
                <span>{mockPlayerData.life}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-blue-400">💧</span>
                <span>{mockPlayerData.mana}/{mockPlayerData.maxMana}</span>
              </div>
            </div>
          </div>

          {/* 自分の手札エリア */}
          <div className="flex justify-center gap-2 p-4">
            {/* 自分の手札は表向きに表示 */}
            {[1, 2, 3, 4].map((i) => (
              <CardView card={mockCard} key={i}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
