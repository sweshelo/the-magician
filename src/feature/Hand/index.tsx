import { HandView } from "@/component/ui/HandView"
import { useWebSocketGame } from "@/hooks/game";
import { useSoundEffect } from "@/hooks/sound/hooks";
import { useSystemContext } from "@/hooks/system/hooks";
import { ICard } from "@/submodule/suit/types";
import { useDndMonitor, DragStartEvent, DragEndEvent } from "@dnd-kit/core";

interface HandAreaProps {
  hand?: ICard[]
}

export const HandArea = ({ hand }: HandAreaProps) => {
  const { activeCard, setActiveCard } = useSystemContext();
  const { override, unitDrive } = useWebSocketGame()
  const { trash, clockUp, draw, drive } = useSoundEffect()
  useDndMonitor({
    onDragStart(e: DragStartEvent) {
      setActiveCard(e.active)
    },
    onDragEnd(e: DragEndEvent) {
      const { over } = e;
      console.log(over)
      switch (over?.data.current?.type) {
        case 'field':
          unitDrive({ target: activeCard?.id as string })
          drive()
          break;
        case 'card':
          override({ target: activeCard?.id as string, parent: over.id as string })
          trash()
          clockUp()
          draw()
          break;
        default:
          break;
      }
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