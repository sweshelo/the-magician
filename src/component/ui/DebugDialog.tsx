'use client';

import { useState, useEffect } from 'react';
import { colorTable } from '@/helper/color';
import { useGame, useWebSocketGame } from '@/hooks/game';
import { useSoundV2 } from '@/hooks/soundV2/hooks';
import { useSystemContext } from '@/hooks/system/hooks';

export const DebugDialog = () => {
  const { self, opponent } = useGame();
  const { send } = useWebSocketGame();
  const { play, setVolume, getVolume, bgm, stopBgm, isPlaying } = useSoundV2();
  const { cursorCollisionSize, setCursorCollisionSize, setOperable } = useSystemContext();
  const [bgmVolume, setBgmVolume] = useState(getVolume());
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const [hide, setHide] = useState(false);

  // Check and update BGM playing status
  useEffect(() => {
    const checkBgmStatus = () => {
      const playing = isPlaying();
      setIsBgmPlaying(playing);
    };

    // Check initially
    checkBgmStatus();

    // Set up periodic checking
    const intervalId = setInterval(checkBgmStatus, 1000);

    return () => clearInterval(intervalId);
  }, [isPlaying]);

  const handleDebugButtonClick = () => {
    console.log('self: ', self, '\nopponent: ', opponent);
  };

  const handleDrawButtonClick = () => {
    play('draw');
    send({
      action: {
        handler: 'core',
        type: 'debug',
      },
      payload: {
        type: 'DebugDraw',
        player: self.status.id!,
      },
    });
  };

  const handleTurnEndClick = () => {
    send({
      action: {
        handler: 'core',
        type: 'event',
      },
      payload: {
        type: 'TurnEnd',
      },
    });
  };

  // カーソル周辺のヒットエリアサイズを増減する
  const increaseCursorSize = () => {
    setCursorCollisionSize(prev => Math.min(prev + 2, 20));
  };

  const decreaseCursorSize = () => {
    setCursorCollisionSize(prev => Math.max(prev - 2, 1));
  };

  // BGMのボリュームを調整する
  const increaseVolume = () => {
    const newVolume = Math.min(bgmVolume + 0.1, 1);
    setBgmVolume(newVolume);
    setVolume(newVolume);
  };

  const decreaseVolume = () => {
    const newVolume = Math.max(bgmVolume - 0.1, 0);
    setBgmVolume(newVolume);
    setVolume(newVolume);
  };

  // BGMの再生/停止を切り替える
  const toggleBgm = async () => {
    if (isBgmPlaying) {
      stopBgm();
      setIsBgmPlaying(false);
    } else {
      // Start BGM playback
      await bgm();
      console.log('BGM playback started');
      setIsBgmPlaying(true);
    }
    setHide(true);
  };

  return (
    !hide && (
      <div
        className={`absolute top-4 left-4 z-50 p-3 rounded-lg shadow-lg ${colorTable.ui.playerInfoBackground} border ${colorTable.ui.border}`}
      >
        <div className="flex flex-col">
          <div className={`text-sm font-bold mb-2 ${colorTable.ui.text.primary}`}>
            Debug Console
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleDebugButtonClick}
              className={`px-3 py-1 rounded ${colorTable.ui.border} bg-slate-600 hover:bg-slate-500 transition-colors`}
            >
              Console
            </button>
            <button
              onClick={handleDrawButtonClick}
              className={`px-3 py-1 rounded ${colorTable.ui.border} bg-slate-600 hover:bg-slate-500 transition-colors`}
            >
              Draw
            </button>
            <button
              onClick={handleTurnEndClick}
              className={`px-3 py-1 rounded ${colorTable.ui.border} bg-lime-600 hover:bg-lime-500 transition-colors`}
            >
              Turn End
            </button>
            <button
              onClick={() => setOperable(true)}
              className={`px-3 py-1 rounded ${colorTable.ui.border} bg-slate-600 hover:bg-slate-500 transition-colors`}
            >
              操作権を得る
            </button>

            {/* カーソル判定サイズコントロール */}
            <div className="mt-2 border-t pt-2 border-gray-700">
              <div className="text-sm mb-1">カーソル判定サイズ: {cursorCollisionSize}px</div>
              <div className="flex gap-2">
                <button
                  onClick={decreaseCursorSize}
                  className={`px-3 py-1 rounded ${colorTable.ui.border} bg-slate-600 hover:bg-slate-500 transition-colors`}
                >
                  -
                </button>
                <button
                  onClick={increaseCursorSize}
                  className={`px-3 py-1 rounded ${colorTable.ui.border} bg-slate-600 hover:bg-slate-500 transition-colors`}
                >
                  +
                </button>
              </div>
            </div>

            {/* BGMボリュームコントロール */}
            <div className="mt-2 border-t pt-2 border-gray-700">
              <div className="text-sm mb-1">BGMボリューム: {Math.round(bgmVolume * 100)}%</div>
              <div className="flex gap-2">
                <button
                  onClick={decreaseVolume}
                  className={`px-3 py-1 rounded ${colorTable.ui.border} bg-slate-600 hover:bg-slate-500 transition-colors`}
                >
                  -
                </button>
                <button
                  onClick={increaseVolume}
                  className={`px-3 py-1 rounded ${colorTable.ui.border} bg-slate-600 hover:bg-slate-500 transition-colors`}
                >
                  +
                </button>
              </div>
            </div>

            {/* BGM再生コントロール */}
            <div className="mt-2 border-t pt-2 border-gray-700">
              <div className="text-sm mb-1">BGM再生: {isBgmPlaying ? '再生中' : '停止中'}</div>
              <div className="flex gap-2">
                <button
                  onClick={toggleBgm}
                  className={`px-3 py-1 rounded ${colorTable.ui.border} ${
                    isBgmPlaying ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'
                  } transition-colors`}
                >
                  {isBgmPlaying ? '停止' : '再生'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
