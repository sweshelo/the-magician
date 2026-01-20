import { useCallback } from 'react';
import { useTimer } from './hooks';
import { useGameStore, useWebSocketGame } from '@/hooks/game';
import { useSystemContext } from '@/hooks/system/hooks';
import { useIsMyTurn } from '@/hooks/game/hooks';

const CircularTimer = () => {
  const { totalSeconds, maxTime } = useTimer();
  const { operable, setOperable } = useSystemContext();
  const { game } = useGameStore();
  const isMyTurn = useIsMyTurn();

  // 残り時間の割合を計算
  const timeRatio = maxTime > 0 ? totalSeconds / maxTime : 0;

  // 残り時間に応じた色を決定
  const getColor = () => {
    if (timeRatio > 0.6) return '#22c55e'; // 緑
    if (timeRatio > 0.3) return '#eab308'; // 黄色
    return '#ef4444'; // 赤
  };

  // SVGの円のパラメータ
  const radius = 80;
  const strokeWidth = 10;
  const center = 100;
  const circumference = 2 * Math.PI * radius;

  // 残り時間に応じたストロークの長さを計算
  const strokeDashoffset = circumference * (timeRatio - 1);

  // 円弧の開始位置を12時の位置にするための回転
  const rotation = 270;

  // 分と秒とミリ秒の表示形式
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const deciseconds = Math.floor((totalSeconds % 1) * 10);
  const timeDisplay = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${deciseconds}`;

  const { send } = useWebSocketGame();
  const turnEnd = useCallback(() => {
    send({
      action: {
        handler: 'core',
        type: 'event',
      },
      payload: {
        type: 'TurnEnd',
      },
    });
    setOperable(false);
  }, [send, setOperable]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-52 h-52">
        {/* バックグラウンドサークル */}
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          {/* タイマーサークル - 時計回りに減少 */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={getColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(${rotation} ${center} ${center})`}
            strokeLinecap="butt"
          />
        </svg>

        {/* 中央の時間表示 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-sm">{`ラウンド ${game.round}`}</div>
          <div className="text-3xl font-bold">{timeDisplay}</div>
          <button
            onClick={turnEnd}
            className="bg-blue-500 bg-lime-600 hover:bg-lime-500 text-white font-medium py-2 px-4 rounded shadow w-30 disabled:bg-lime-700"
            disabled={!operable}
          >
            {isMyTurn ? 'ターン終了' : <span className="text-xs">対戦相手行動中</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

// 使用例
export const Timer = () => {
  return (
    <div className="flex items-center justify-end h-full mr-4">
      <CircularTimer />
    </div>
  );
};
