import { BackFlipedCard } from "@/component/ui/BackFlipedCard"
import { CardView } from "@/component/ui/CardView"
import { RotatedSquareHighlight } from "@/component/ui/RotatedSquareHighlight"
import { useGame } from "@/hooks/game"
import { useInterceptUsage } from "@/hooks/intercept-usage"
import master from "@/submodule/suit/catalog/catalog"

export const MyTriggerZoneBody = () => {
  const { self } = useGame()
  const { availableIntercepts, activateIntercept } = useInterceptUsage()

  return (
    <div className="flex gap-1">
      {
        [...Array(4)].map((_, index) => {
          const card = self.trigger[index]
          const catalog = card ? master.get(card.catalogId) : undefined
          const isUnit = catalog?.type === 'unit' || catalog?.type === 'advanced_unit'

          // Check if this card is in the available intercepts list
          const isAvailable = card && !isUnit && availableIntercepts.some(intercept => intercept.id === card.id)

          return card ? (
            isUnit ? (
              <BackFlipedCard card={card} key={index} />
            ) : (
              <RotatedSquareHighlight
                isVisible={isAvailable}
                key={index}
                onClick={() => card && isAvailable && activateIntercept(card.id)}
              >
                <CardView card={card} isSmall isHighlighting={isAvailable} />
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
