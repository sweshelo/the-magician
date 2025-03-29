import { HandView } from "@/component/ui/HandView"
import { useSystemContext } from "@/hooks/system/hooks";
import { ICard } from "@/submodule/suit/types";
import { useDndMonitor, DragStartEvent } from "@dnd-kit/core";

interface HandAreaProps {
  hand?: ICard[]
}

export const HandArea = ({ hand }: HandAreaProps) => {
  const { setActiveCard } = useSystemContext();
  useDndMonitor({
    onDragStart(e: DragStartEvent) {
      setActiveCard(e.active)
    },
    onDragEnd() {
      setActiveCard(undefined)
    }
  })

  return (
    <div className="flex justify-center gap-2 p-4 min-h-[120px]">
      {hand?.map((card, index) => (
        <HandView key={`hand-card-${index}`} card={card} />
      ))}
    </div>
  )
}