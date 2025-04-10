import { useGame } from "@/hooks/game";
import { useSystemContext } from "@/hooks/system/hooks";
import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

interface MyTriggerZoneWrapperProps {
  children: ReactNode
}

export const MyTriggerZoneWrapper = ({ children }: MyTriggerZoneWrapperProps) => {
  const { activeCard } = useSystemContext()
  const { self, rule } = useGame();
  const { isOver, setNodeRef } = useDroppable({
    id: 'trigger-zone',
    data: {
      type: 'trigger-zone',
      accepts: ['card']
    },
    disabled: self.trigger.length >= rule.player.max.trigger,
  })

  return (
    <div
      ref={setNodeRef}
      className="relative"
    >
      {/* Field content */}
      {children}

      {/* Field highlight animation when card is dragged over */}
      {activeCard && isOver && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div
            className="absolute border-2 rounded-lg w-4/5 h-4/5 animate-field-highlight"
            style={{ borderColor: 'rgba(255, 255, 255, 0.6)' }}
          />
        </div>
      )}
    </div>
  )
}
