"use client";

import { colorTable } from "@/helper/color";
import { useCardEffectDialog } from "@/hooks/card-effect-dialog";

export const CardEffectDialog = () => {
  const { state } = useCardEffectDialog();
  const { isVisible, title, message } = state;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className={`
          rounded-lg shadow-lg
          ${colorTable.ui.playerInfoBackground}
          border ${colorTable.ui.border}
          p-4 max-w-md w-full
          transition-opacity duration-300 ease-in-out
          backdrop-blur-sm
        `}
      >
        <div className="flex flex-col">
          {/* Title - 1 line */}
          <div
            className={`text-xl font-bold mb-2 ${colorTable.ui.text.primary} text-center`}
          >
            {title}
          </div>

          {/* Message - up to 4 lines */}
          <div
            className={`${colorTable.ui.text.secondary} whitespace-pre-line text-center border-t-2 pt-3`}
          >
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};
