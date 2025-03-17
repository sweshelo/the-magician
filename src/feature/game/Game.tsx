'use client';
import { useState } from 'react';

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

  // モックカードデータ
  const mockCard = {
    id: 'card-1',
    name: 'ファイアボール',
    cost: 3,
    attack: 5,
    defense: 2,
    effect: '相手に3ダメージを与える',
    description: 'このカードは手札から直接プレイでき、相手のライフに3ポイントのダメージを与えます。防御力の高い対戦相手に対して有効です。',
    image: '🔥',
    type: '呪文',
    rarity: 'レア',
  };

  // 詳細ウィンドウの表示状態
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  // 選択されたカード
  const [selectedCard, setSelectedCard] = useState<typeof mockCard | null>(mockCard);

  // カードをクリックした時の処理
  const handleCardClick = (card: typeof mockCard) => {
    setSelectedCard(card);
    setIsDetailOpen(true);
  };

  // 詳細ウィンドウを閉じる
  const closeDetail = () => {
    setIsDetailOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white relative">
      {/* カード詳細ウィンドウ */}
      {isDetailOpen && selectedCard && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-64 bg-slate-800 rounded-lg shadow-lg z-10 border border-slate-700 overflow-hidden">
          {/* ウィンドウヘッダー */}
          <div className="flex justify-between items-center p-3 bg-slate-700">
            <h3 className="font-bold">カード詳細</h3>
            <button 
              onClick={closeDetail}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          {/* カード情報 */}
          <div className="p-4">
            {/* カード名と属性 */}
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-lg">{selectedCard.name}</h4>
              <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                {selectedCard.cost}
              </div>
            </div>
            
            {/* カード画像 */}
            <div className="bg-slate-700 rounded-md h-32 flex items-center justify-center text-5xl mb-3">
              {selectedCard.image}
            </div>
            
            {/* カード種類と希少度 */}
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>{selectedCard.type}</span>
              <span>{selectedCard.rarity}</span>
            </div>
            
            {/* 攻撃力と防御力 */}
            <div className="flex justify-between mb-4">
              <div className="flex items-center">
                <span className="bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-1">
                  {selectedCard.attack}
                </span>
                <span className="text-xs">攻撃力</span>
              </div>
              <div className="flex items-center">
                <span className="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-1">
                  {selectedCard.defense}
                </span>
                <span className="text-xs">防御力</span>
              </div>
            </div>
            
            {/* 効果 */}
            <div className="mb-3">
              <h5 className="text-xs uppercase tracking-wide text-slate-400 mb-1">効果</h5>
              <p className="text-sm bg-slate-700 p-2 rounded">{selectedCard.effect}</p>
            </div>
            
            {/* 説明 */}
            <div>
              <h5 className="text-xs uppercase tracking-wide text-slate-400 mb-1">説明</h5>
              <p className="text-xs text-slate-300 italic">{selectedCard.description}</p>
            </div>
          </div>
        </div>
      )}

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
              <div 
                key={`opponent-field-${i}`} 
                className="w-20 h-28 border-2 border-dashed border-slate-600 rounded-lg flex justify-center items-center text-slate-500"
              >
                {i === 3 ? (
                  <div 
                    className="w-full h-full bg-slate-700 rounded p-2 flex flex-col text-xs shadow-lg relative cursor-pointer"
                    onClick={() => handleCardClick(mockCard)}
                  >
                    <div className="flex justify-between mb-1">
                      <div className="truncate max-w-[70%]">{mockCard.name}</div>
                      <div className="bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        {mockCard.cost}
                      </div>
                    </div>
                    <div className="flex-1 flex justify-center items-center bg-slate-800 rounded text-3xl">
                      {mockCard.image}
                    </div>
                    <div className="absolute bottom-1 left-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {mockCard.attack}
                    </div>
                    <div className="absolute bottom-1 right-1 bg-green-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {mockCard.defense}
                    </div>
                  </div>
                ) : ''}
              </div>
            ))}
          </div>

          {/* 自分のフィールド */}
          <div className="flex justify-center gap-4 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={`player-field-${i}`} 
                className="w-20 h-28 border-2 border-dashed border-slate-600 rounded-lg flex justify-center items-center text-slate-500"
              >
                {i === 2 ? (
                  <div 
                    className="w-full h-full bg-slate-700 rounded p-2 flex flex-col text-xs shadow-lg relative cursor-pointer"
                    onClick={() => handleCardClick({
                      ...mockCard,
                      id: 'card-2',
                      name: '黒魔術師',
                      cost: 4,
                      attack: 4,
                      defense: 3,
                      effect: '場に出た時、相手の呪文1枚を無効にする',
                      description: '黒魔術の達人。相手の呪文に対抗し、バトルの流れを変えることができる。',
                      image: '🧙',
                      type: 'クリーチャー',
                      rarity: 'アンコモン',
                    })}
                  >
                    <div className="flex justify-between mb-1">
                      <div className="truncate max-w-[70%]">黒魔術師</div>
                      <div className="bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        4
                      </div>
                    </div>
                    <div className="flex-1 flex justify-center items-center bg-slate-800 rounded text-3xl">
                      🧙
                    </div>
                    <div className="absolute bottom-1 left-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                    <div className="absolute bottom-1 right-1 bg-green-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                  </div>
                ) : ''}
              </div>
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
              <div 
                key={`player-hand-${i}`}
                onClick={() => handleCardClick({
                  ...mockCard,
                  id: `card-hand-${i}`,
                  name: i % 2 === 0 ? 'ライトニングボルト' : 'シールドウォール',
                  cost: i + 1,
                  attack: i % 2 === 0 ? i + 2 : i - 1,
                  defense: i % 2 === 0 ? i - 1 : i + 2,
                  effect: i % 2 === 0 ? `相手に${i}ダメージを与える` : `自分の防御力を${i}上げる`,
                  description: i % 2 === 0 ? '強力な電撃で相手を攻撃します。' : '魔法の壁で身を守ります。',
                  image: i % 2 === 0 ? '⚡' : '🛡️',
                  type: i % 2 === 0 ? '呪文' : '防御',
                  rarity: i === 1 ? 'レア' : 'コモン',
                })}
                className="w-16 h-24 bg-slate-700 rounded flex flex-col p-1 shadow-md text-xs relative cursor-pointer hover:translate-y-[-10px] transition-transform"
              >
                <div className="flex justify-between mb-1">
                  <div className="truncate max-w-[70%]">{i % 2 === 0 ? 'ライトニング' : 'シールド'}</div>
                  <div className="bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </div>
                </div>
                <div className="flex-1 flex justify-center items-center bg-slate-800 rounded text-xl">
                  {i % 2 === 0 ? '⚡' : '🛡️'}
                </div>
                <div className="absolute bottom-1 left-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                  {i % 2 === 0 ? i + 2 : i - 1}
                </div>
                <div className="absolute bottom-1 right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                  {i % 2 === 0 ? i - 1 : i + 2}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
