'use client';

import { colorTable } from '@/helper/color';
import { useCardsDialog } from '@/hooks/cards-dialog';
import { useGame, useWebSocketGame } from '@/hooks/game';
import { useSoundEffect } from '@/hooks/sound/hooks';
import { useUnitSelection } from '@/hooks/unit-selection';
import { ICard } from '@/submodule/suit/types';

export const DebugDialog = () => {
  const { self, opponent } = useGame();
  const { send } = useWebSocketGame();
  const { draw } = useSoundEffect();
  const { openCardsSelector } = useCardsDialog();
  const { showSelectionButton } = useUnitSelection();

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
        </div>
      </div>
    </div>
  );
};
