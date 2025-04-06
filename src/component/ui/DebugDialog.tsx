'use client';

import { colorTable } from '@/helper/color';
import { useCardsDialog } from '@/hooks/cards-dialog';
import { useGame, useWebSocketGame } from '@/hooks/game';
import { useInterceptUsage } from '@/hooks/intercept-usage';
import { useSoundEffect } from '@/hooks/sound/hooks';
import { useSystemContext } from '@/hooks/system/hooks';
import { useUnitSelection } from '@/hooks/unit-selection';
import master from '@/submodule/suit/catalog/catalog';
import { ICard } from '@/submodule/suit/types';

export const DebugDialog = () => {
  const { self, opponent } = useGame();
  const { send } = useWebSocketGame();
  const { draw } = useSoundEffect();
  const { openCardsSelector } = useCardsDialog();
  const { showSelectionButton } = useUnitSelection();
  const { cursorCollisionSize, setCursorCollisionSize } = useSystemContext();
  const { setAvailableIntercepts, clearAvailableIntercepts } = useInterceptUsage();

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

  // New function to test the selection button functionality
  const handleShowSelectButton = () => {
    // Find the first unit in the player's field to test with
    if (self.field.length > 0) {
      showSelectionButton(self.field[0].id, 'select');
    }
  };

  // New function to test the target button functionality
  const handleShowTargetButton = () => {
    // Test with opponent's first unit if available
    if (opponent.field.length > 0) {
      showSelectionButton(opponent.field[0].id, 'target');
    }
  };

  // New function to test the block button functionality
  const handleShowBlockButton = () => {
    // Test with player's first unit if available
    if (self.field.length > 0) {
      showSelectionButton(self.field[0].id, 'block');
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
      console.log('Set intercept available with 10s time limit:', interceptCards[0]);
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
            onClick={handleShowSelectButton}
            className={`px-3 py-1 rounded ${colorTable.ui.border} bg-white text-black hover:bg-gray-200 transition-colors`}
          >
            Show 選択
          </button>
          <button
            onClick={handleShowTargetButton}
            className={`px-3 py-1 rounded ${colorTable.ui.border} bg-red-500 text-white hover:bg-red-600 transition-colors`}
          >
            Show ターゲット
          </button>
          <button
            onClick={handleShowBlockButton}
            className={`px-3 py-1 rounded ${colorTable.ui.border} bg-blue-500 text-white hover:bg-blue-600 transition-colors`}
          >
            Show ブロック
          </button>
          
          <button
            onClick={handleTestInterceptButton}
            className={`px-3 py-1 rounded ${colorTable.ui.border} bg-green-500 text-white hover:bg-green-600 transition-colors`}
          >
            Timed Intercept (10s)
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
        </div>
      </div>
    </div>
  );
};
