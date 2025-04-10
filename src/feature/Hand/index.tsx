import { HandView } from "@/component/ui/HandView"
import { useGame } from "@/hooks/game"
import { ICard } from "@/submodule/suit/types"
import { useMemo } from "react"

interface HandAreaProps {
  hand?: ICard[]
}

export const HandArea = ({ hand }: HandAreaProps) => {
  const { rule } = useGame()
  const handCards = hand || []
  
  // Calculate the width needed for all placeholder slots
  const containerWidth = useMemo(() => {
    const cardWidth = 116;
    const gapWidth = 8;
    const totalWidth = (cardWidth * rule.player.max.hand) + (gapWidth * (rule.player.max.hand - 1));
    return totalWidth;
  }, [rule.player.max.hand]);

  return (
    <div 
      className="p-4 min-h-[180px] relative" 
      style={{ minWidth: `${containerWidth}px` }}
    >
      {/* Placeholders - always display for all slots - left aligned */}
      <div className="flex justify-start gap-2 absolute inset-0 p-4 pointer-events-none">
        {
          [...Array(rule.player.max.hand)].map((_, index) => (
            <div 
              className="w-28 h-39 border-1 border-white border-opacity-20 rounded-sm bg-gray-800 bg-opacity-20" 
              key={`placeholder-${index}`} 
            />
          ))
        }
      </div>
      
      {/* Actual cards - left aligned */}
      <div className="flex justify-start gap-2 relative">
        {handCards.map((card, index) => (
          <HandView key={`hand-card-${index}`} card={card} />
        ))}
      </div>
    </div>
  )
}
