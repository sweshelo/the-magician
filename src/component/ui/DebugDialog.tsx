'use client';

import { colorTable } from '@/helper/color';
import { useGame, useWebSocketGame } from '@/hooks/game';
import { useHandler } from '@/hooks/game/handler';
import { useSoundEffect } from '@/hooks/sound/hooks';

export const DebugDialog = () => {
  const { self, opponent } = useGame()
  const { send } = useWebSocketGame()
  const { draw } = useSoundEffect();
  const { showCardEffect } = useHandler();

  const handleDebugButtonClick = () => {
    console.log('self: ', self, '\nopponent: ', opponent)
  }

  const handleDrawButtonClick = () => {
    console.log()
    draw()
    send({
      action: {
        handler: 'core',
        type: 'debug'
      },
      payload: {
        type: 'DebugDraw',
        player: self.status.id!,
      }
    })
  }

  return (
    <div className={`absolute top-4 right-4 z-50 p-3 rounded-lg shadow-lg ${colorTable.ui.playerInfoBackground} border ${colorTable.ui.border}`}>
      <div className="flex flex-col">
        <div className={`text-sm font-bold mb-2 ${colorTable.ui.text.primary}`}>Debug Console</div>
        <div className='flex flex-col gap-2'>
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
            onClick={() => showCardEffect('カード効果発動', '相手ユニット1体に\n4ダメージを与えます。')}
            className={`px-3 py-1 rounded ${colorTable.ui.border} bg-red-600 hover:bg-red-500 transition-colors`}
          >
            Show Effect
          </button>
        </div>
      </div>
    </div>
  );
};
