'use client';

import { colorTable } from '@/helper/color';
import { useCardsDialog } from '@/hooks/cards-dialog';
import { useGame, useWebSocketGame } from '@/hooks/game';
import { useInterceptUsage } from '@/hooks/intercept-usage';
import { useSoundEffect } from '@/hooks/sound/hooks';
import { useSystemContext } from '@/hooks/system/hooks';
import { useUnitIconEffect } from '@/hooks/unit-icon-effect';
import master from '@/submodule/suit/catalog/catalog';
import { ICard, IUnit } from '@/submodule/suit/types';
import { UnitView } from './UnitView';
import { useHandler } from '@/hooks/game/handler';

export const DebugDialog = () => {
  const { self, opponent } = useGame();
  const { send } = useWebSocketGame();
  const { draw } = useSoundEffect();
  const { openCardsSelector } = useCardsDialog();
  const { cursorCollisionSize, setCursorCollisionSize } = useSystemContext();
  const { setAvailableIntercepts, clearAvailableIntercepts } = useInterceptUsage();
  const { showEffect, isAnimating, triggerEffect, handleAnimationComplete } = useUnitIconEffect();
  const { handleUnitSelection } = useHandler()

  // Sample unit for testing animation effect
  const sampleUnit: IUnit = {
    id: 'sample-unit',
    catalogId: 'unit01',
    lv: 1,
    bp: {
      base: 1000,
      diff: 0,
      damage: 0
    },
    active: true
  };

  const handleDebugButtonClick = () => {
    console.log('self: ', self, '\nopponent: ', opponent);
  };

  const handleDrawButtonClick = () => {
    draw();
    send({
      action: {
        handler: 'core',
        type: 'debug'
      },
      payload: {
        type: 'DebugDraw',
        player: self.status.id!,
      }
    });
  };

  const handleTurnEndClick = () => {
    send({
      action: {
        handler: 'core',
        type: 'event'
      },
      payload: {
        type: 'TurnEnd',
      }
    })
  }

  // カーソル周辺のヒットエリアサイズを増減する
  const increaseCursorSize = () => {
    setCursorCollisionSize(prev => Math.min(prev + 2, 20));
  };

  const decreaseCursorSize = () => {
    setCursorCollisionSize(prev => Math.max(prev - 2, 1));
  };

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
            onClick={handleTurnEndClick}
            className={`px-3 py-1 rounded ${colorTable.ui.border} bg-lime-600 hover:bg-lime-500 transition-colors`}
          >
            Turn End
          </button>
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

        </div>
      </div>
    </div>
  );
};
