import { CardView } from "@/component/ui/CardView"
import { useEffect, useState } from "react"
import { useCardsDialog } from "@/hooks/cards-dialog"

export const CardsDialog = () => {
  const { cards, dialogTitle, isOpen, closeCardsDialog } = useCardsDialog();
  const [isAnimating, setIsAnimating] = useState(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Overlay for click-outside behavior */}
      {isOpen && (
        <div
          className="absolute inset-0 bg-black/50 transition-opacity duration-100 pointer-events-auto"
          style={{ opacity: isAnimating ? 1 : 0 }}
          onClick={closeCardsDialog}
        />
      )}

      <div
        className="flex flex-col items-center max-w-full w-full pointer-events-auto"
        style={{
          transform: `scaleX(${isAnimating ? 1 : 0})`,
          transition: 'transform 100ms ease-in-out',
          transformOrigin: 'center',
        }}
      >
        {/* Title positioned outside the main panel */}
        <div
          className="bg-slate-700 text-white px-4 py-2 rounded-t-lg font-bold z-10 mb-[-1px]"
          style={{
            opacity: isAnimating ? 1 : 0,
            transition: 'opacity 100ms ease-in-out',
          }}
        >
          {dialogTitle}
        </div>

        {/* Main panel content */}
        <div
          className="bg-slate-800/35 rounded-lg w-full p-4 overflow-auto h-[500]"
          style={{
            opacity: isAnimating ? 1 : 0,
            transition: 'opacity 100ms ease-in-out',
          }}
        >
          {/* Center container */}
          <div className="flex justify-center">
            {/* Card container with max-width for 10 cards, left-aligned */}
            <div className="flex flex-wrap justify-start gap-2 w-[calc(10*112px+9*8px)]">
              {cards?.map(card => (
                <CardView card={card} key={card.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
