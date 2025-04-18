import { CardView } from "@/component/ui/CardView";
import { useCallback, useEffect, useState, useRef } from "react";
import { useCardsDialog } from "@/hooks/cards-dialog";
import { ICard } from "@/submodule/suit/types";
import { ProgressConfirmButton } from "@/component/ui/ProgressConfirmButton";

export const CardsDialog = () => {
  const {
    cards,
    dialogTitle,
    isOpen,
    isSelector,
    count,
    closeCardsDialog,
    selection,
    setSelection,
    confirmSelection,
    timeLimit,
  } = useCardsDialog();
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationKey = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  // Handle card click
  const handleCardClick = useCallback(
    (card: ICard) => {
      if (isSelector) {
        setSelection((prev) =>
          [...prev.filter((c) => c !== card.id), card.id].slice(-1 * count),
        );
      }
    },
    [count, isSelector, setSelection],
  );

  // Handle time expiration and auto-confirm
  const handleTimeExpiration = useCallback(() => {
    console.log("Time expired!");
    // 時間切れで確定された時、足りない分のカードを先頭から自動で選択する
    confirmSelection([
      ...selection,
      ...(cards
        ?.map((card) => card.id)
        .filter((id) => !selection.includes(id))
        .slice(0, count - selection.length) ?? []),
    ]);
  }, [cards, confirmSelection, count, selection]);

  // Handle dialog opening - initialize the timer only when dialog opens
  useEffect(() => {
    if (isOpen && isSelector && timeLimit && !startTimeRef.current) {
      // Only increment the animation key when the dialog first opens with a time limit
      animationKey.current += 1;
      startTimeRef.current = Date.now();

      // Set a single timeout for when time is up - as a fallback
      timeoutRef.current = setTimeout(
        () => {
          handleTimeExpiration();
        },
        timeLimit * 1000 + 100,
      ); // Add a small buffer to ensure animation completes first
    } else if (!isOpen) {
      // Reset when dialog closes
      startTimeRef.current = null;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isOpen, isSelector, timeLimit, handleTimeExpiration]);

  // Handle animation when the dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      // Give time for the closing animation to play
      const timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Don't render anything if the dialog is not open and not animating
  if (!isOpen && !isAnimating) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
      {/* Overlay for click-outside behavior */}
      {isOpen &&
        (!isSelector ? (
          <div
            className="absolute inset-0 transition-opacity duration-100 pointer-events-auto"
            style={{ opacity: isAnimating ? 1 : 0 }}
            onClick={closeCardsDialog}
          />
        ) : (
          <div className="absolute inset-0 duration-100 bg-black/35" />
        ))}

      <div
        className="flex flex-col items-center max-w-full w-full pointer-events-auto"
        style={{
          transform: `scaleX(${isAnimating ? 1 : 0})`,
          transition: "transform 100ms ease-in-out",
          transformOrigin: "center",
        }}
      >
        {/* Title positioned outside the main panel */}
        <div
          className="bg-slate-700 text-white px-4 py-2 rounded-t-lg font-bold z-10 mb-[-1px]"
          style={{
            opacity: isAnimating ? 1 : 0,
            transition: "opacity 100ms ease-in-out",
          }}
        >
          {dialogTitle}
        </div>

        {/* Main panel content */}
        <div
          className="bg-slate-800/35 w-full p-4 overflow-auto h-[520] border-y-3 border-white p-3"
          style={{
            opacity: isAnimating ? 1 : 0,
            transition: "opacity 100ms ease-in-out",
          }}
        >
          {/* Center container */}
          <div className="flex justify-center">
            {/* Card container with max-width for 10 cards, left-aligned */}
            <div className="flex flex-wrap justify-start gap-2 w-[calc(10*112px+9*8px)]">
              {cards?.map((card) => (
                <CardView
                  card={card}
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  isHighlighting={selection.includes(card.id)}
                  isSelecting={selection.includes(card.id)}
                />
              ))}
            </div>
          </div>
        </div>
        {/* 確定ボタン */}
        {(isOpen || isAnimating) && isSelector && (
          <ProgressConfirmButton
            timeLimit={timeLimit || undefined}
            buttonText="確定"
            onConfirm={() => confirmSelection()}
            onTimeExpire={handleTimeExpiration}
            disabled={selection.length !== count}
            className="mt-4 bottom-10 z-15"
            isRunning={isOpen}
          />
        )}
      </div>
    </div>
  );
};
