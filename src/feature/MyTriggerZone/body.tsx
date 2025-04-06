import { BackFlipedCard } from "@/component/ui/BackFlipedCard"
import { CardView } from "@/component/ui/CardView"
import { RotatedSquareHighlight } from "@/component/ui/RotatedSquareHighlight"
import { useGame } from "@/hooks/game"
import master from "@/submodule/suit/catalog/catalog"

export const MyTriggerZoneBody = () => {
  const { self } = useGame()
  
  return (
    <div className="flex gap-1">
      {
        [...Array(4)].map((_, index) => {
          const card = self.trigger[index]
          const catalog = card ? master.get(card.catalogId) : undefined
          const isUnit = catalog?.type === 'unit' || catalog?.type === 'advanced_unit'

          // Only show highlight for non-unit cards
          const shouldShowHighlight = card && !isUnit

          return card ? (
            isUnit ? (
              <BackFlipedCard card={card} key={index} />
            ) : (
              <RotatedSquareHighlight isVisible={shouldShowHighlight} key={index}>
                <CardView card={card} isSmall isHighlighting />
              </RotatedSquareHighlight>
            )
          ) : (
            <div className="w-19 h-26 border-1 border-white rounded-sm bg-gray-800" key={index} />
          )
        })
      }
    </div>
  )
}
