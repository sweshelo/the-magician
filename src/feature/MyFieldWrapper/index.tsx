import { ReactNode } from "react"
import { useDroppable } from "@dnd-kit/core"
import { useSystemContext } from "@/hooks/system/hooks"
import { useGame } from "@/hooks/game"
import catalog from "@/submodule/suit/catalog/catalog"

interface MyFieldWrapperProps {
  children: ReactNode
}

export const MyFieldWrapper = ({ children }: MyFieldWrapperProps) => {
  const { activeCard } = useSystemContext()
  const { self, rule } = useGame();
  const { isOver, setNodeRef } = useDroppable({
    id: 'field',
    data: {
      type: 'field',
      accepts: ['card']
    },
    disabled: self.field.length >= rule.player.max.field || catalog.get(activeCard?.data.current?.type)?.type !== 'unit',
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
