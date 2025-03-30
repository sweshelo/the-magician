import { ICard } from "@/submodule/suit/types"
import { CardView } from "./CardView"
import { useEffect, useState, useRef } from "react"

interface CardsPanelProps {
  cards: ICard[]
  open: boolean
  title?: string
  onClose?: () => void
}

export const CardsPanel = ({ cards, open, title = "Cards", onClose }: CardsPanelProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const firstRender = useRef(true)

  useEffect(() => {
    if (open) {
      setIsVisible(true)
      // Small delay to ensure the initial render happens with scale(0) before animating
      const timer = setTimeout(() => {
        setIsAnimating(true)
      }, 50)
      return () => clearTimeout(timer)
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 100) // Transition duration
      return () => clearTimeout(timer)
    }
  }, [open])

  // Skip animation on first render if dialog is closed
  useEffect(() => {
    if (firstRender.current && !open) {
      firstRender.current = false
    }
  }, [open])

  const handleOverlayClick = () => {
    if (onClose) {
      onClose()
    }
  }

  if (!isVisible && !open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Overlay for click-outside behavior */}
      {open && (
        <div
          className="absolute inset-0 bg-black/50 transition-opacity duration-100 pointer-events-auto"
          style={{ opacity: isAnimating ? 1 : 0 }}
          onClick={handleOverlayClick}
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
          {title}
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
              {cards.map(card => (
                <CardView card={card} key={card.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
