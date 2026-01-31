'use client';

import { useGameResult } from '@/hooks/game-result';
import { useRouter } from 'next/navigation';
import { Button } from '@/component/interface/button';

export const GameResultOverlay = () => {
  const { state } = useGameResult();
  const { isVisible, reason, result, showExitButton } = state;
  const router = useRouter();

  if (!isVisible) {
    return null;
  }

  // 終了理由テキスト
  const reasonText = reason === 'damage' ? 'KO' : 'ROUND LIMIT';
  const reasonSubText = '戦闘状況終了';

  // 勝敗テキストとスタイル
  const resultText = result === 'win' ? 'WIN' : 'LOSE';
  const resultColorClass =
    result === 'win'
      ? 'text-yellow-400 drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]'
      : 'text-red-500 drop-shadow-[0_0_20px_rgba(255,0,0,0.8)]';

  // 円形エフェクトの色
  const circleColorClass = result === 'win' ? 'border-yellow-500' : 'border-red-500';

  const handleExit = () => {
    router.push('/entrance');
  };

  return (
    <div
      className="fixed inset-0 w-screen h-screen flex items-center justify-center z-50"
      style={{ animation: 'fadeIn 0.1s forwards' }}
    >
      {/* 背景オーバーレイ */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Expanding Circle */}
      <div
        className={`absolute rounded-full border-8 opacity-80 h-[30vh] w-[30vh] ${circleColorClass}`}
        style={{ animation: 'expand 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' }}
      />

      {/* Text Container */}
      <div
        className="relative w-full flex flex-col items-center justify-center gap-4"
        style={{ animation: 'textFadeIn 0.3s 0.2s forwards', opacity: 0 }}
      >
        {/* Fading Black Band */}
        <div className="absolute w-full h-64 bg-gradient-to-r from-transparent via-black/90 to-transparent z-0" />

        {/* 終了理由テキスト */}
        <div className="relative z-10 text-center text-white font-bold drop-shadow-md">
          <span className="text-5xl tracking-widest">{reasonText}</span>
          {reasonSubText && <span className="block text-xl mt-1">{reasonSubText}</span>}
        </div>

        {/* 勝敗テキスト */}
        <div className="relative z-10 text-center font-bold mt-4">
          <span className={`text-7xl tracking-wider ${resultColorClass}`}>{resultText}</span>
        </div>

        {/* 退室ボタン */}
        {showExitButton && (
          <div className="relative z-10 mt-8" style={{ animation: 'textFadeIn 0.3s forwards' }}>
            <Button onClick={handleExit} size="lg" className="px-8 py-3 text-xl">
              退室
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
