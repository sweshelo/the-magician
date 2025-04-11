"use client";

import { colorTable } from "@/helper/color";
import { useGame, useWebSocketGame } from "@/hooks/game";
import { useSoundEffect } from "@/hooks/sound/hooks";
import { useSystemContext } from "@/hooks/system/hooks";

export const DebugDialog = () => {
  const { self, opponent } = useGame();
  const { send } = useWebSocketGame();
  const { draw } = useSoundEffect();
  const { cursorCollisionSize, setCursorCollisionSize, setOperable } = useSystemContext();

  const handleDebugButtonClick = () => {
    console.log("self: ", self, "\nopponent: ", opponent);
  };

  const handleDrawButtonClick = () => {
    draw();
    send({
      action: {
        handler: "core",
        type: "debug",
      },
      payload: {
        type: "DebugDraw",
        player: self.status.id!,
      },
    });
  };

  const handleTurnEndClick = () => {
    send({
      action: {
        handler: "core",
        type: "event",
      },
      payload: {
        type: "TurnEnd",
      },
    });
  };

  // カーソル周辺のヒットエリアサイズを増減する
  const increaseCursorSize = () => {
    setCursorCollisionSize((prev) => Math.min(prev + 2, 20));
  };

  const decreaseCursorSize = () => {
    setCursorCollisionSize((prev) => Math.max(prev - 2, 1));
  };

  return (
    <div
      className={`absolute top-4 right-4 z-50 p-3 rounded-lg shadow-lg ${colorTable.ui.playerInfoBackground} border ${colorTable.ui.border}`}
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
          <div className="mt-2 border-t pt-2 border-gray-700">
            <div className="text-sm mb-1">
              カーソル判定サイズ: {cursorCollisionSize}px
            </div>
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
