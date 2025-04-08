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

  // New function to test the target button functionality
  const handleShowTargetButton = async() => {
    // Test with opponent's first unit if available
    if (self.field.length > 0) {
      console.log(await handleUnitSelection(self.field, 'target'));
    }
  };

  // New function to test the intercept usage functionality
  const handleTestInterceptButton = () => {
    // Test with the first available intercept card in trigger zone (if any)
    const interceptCards = self.trigger.filter(card => {
      if (!card) return false;
      const catalog = master.get(card.catalogId);
      return catalog?.type === 'intercept' || catalog?.type === 'trigger';
    });

    if (interceptCards.length > 0) {
      // Set the first intercept card as available with a 10 second time limit
      setAvailableIntercepts([interceptCards[0]], 10);
      console.log('Set intercept available:', interceptCards[0]);
    } else {
      console.log('No intercept cards in trigger zone to test with');
    }
  };

  // Function to clear available intercepts for testing
  const handleClearInterceptsButton = () => {
    clearAvailableIntercepts();
    console.log('Cleared available intercepts');
  };

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
            onClick={() => openCardsSelector(self.deck as ICard[], 'Select Cards (5秒)', 2, { timeLimit: 5 }).then(selected => console.log('Timed selection:', selected))}
            className={`px-3 py-1 rounded ${colorTable.ui.border} bg-slate-600 hover:bg-red-500 transition-colors`}
          >
            Timed Select
          </button>
          <button
            onClick={handleShowTargetButton}
            className={`px-3 py-1 rounded ${colorTable.ui.border} bg-red-500 text-white hover:bg-red-600 transition-colors`}
          >
            Show ターゲット
          </button>
          <button
            onClick={handleTestInterceptButton}
            className={`px-3 py-1 rounded ${colorTable.ui.border} bg-green-500 text-white hover:bg-green-600 transition-colors`}
          >
            Enable Intercept
          </button>

          <button
            onClick={handleClearInterceptsButton}
            className={`px-3 py-1 rounded ${colorTable.ui.border} bg-slate-600 hover:bg-slate-500 transition-colors`}
          >
            Clear Intercepts
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

          {/* Unit Icon Effect Test Section */}
          <div className="mt-4 border-t pt-4 border-gray-700">
            <div className={`text-sm font-bold mb-2 ${colorTable.ui.text.primary}`}>
              アニメーションエフェクト
            </div>

            {/* Sample Unit for testing animation */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <UnitView
                  unit={sampleUnit}
                  showEffect={showEffect}
                  onEffectComplete={handleAnimationComplete}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  console.log('Animation trigger button clicked');
                  triggerEffect();
                  console.log('Animation state after trigger:', { showEffect, isAnimating });
                }}
                disabled={isAnimating}
                className={`px-3 py-1 rounded ${colorTable.ui.border} ${isAnimating ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500'
                  } text-white transition-colors`}
              >
                {isAnimating ? 'アニメーション中...' : 'エフェクト実行'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
