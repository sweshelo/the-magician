import { HandView } from "@/component/ui/HandView"
import { ICard } from "@/submodule/suit/types"

interface HandAreaProps {
  hand?: ICard[]
}

export const HandArea = ({ hand }: HandAreaProps) => {
  return (
    <div className="flex justify-center gap-2 p-4 min-h-[120px]">
      {hand?.map((card, index) => (
        <HandView key={`hand-card-${index}`} card={card} />
      ))}
    </div>
  )
}