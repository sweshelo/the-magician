import { Card } from "@/type/game/Card"
import { useSystemContext } from "@/hooks/system/hooks";
import { useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import type { Active, DragStartEvent } from "@dnd-kit/core";
import { useCallback, useState } from "react";
import { CardView } from "./CardView";

interface Props {
  card: Card
}

export const HandView = ({ card }: Props) => {
  const [activeCard, setActiveCard] = useState<Active>();
  const { operable } = useSystemContext();
  const { attributes, listeners, setNodeRef: setDraggableRef, transform } = useDraggable({
    id: card.id,
    disabled: !operable,
    data: {
      type: card.catalogId
    }
  });
  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: card.id,
    disabled: activeCard?.id === card.id || card.catalogId !== activeCard?.data.current?.type,
    data: {
      supports: [card.catalogId]
    }
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    backgroundColor: isOver ? 'green' : undefined,
  };

  const setNodeRef = useCallback((ref: HTMLElement | null) => {
    setDraggableRef(ref)
    setDroppableRef(ref)
  }, [setDraggableRef, setDroppableRef])

  useDndMonitor({
    onDragStart(e: DragStartEvent) {
      setActiveCard(e.active)
    }
  })

  return (
    <div
      className="w-20 h-28"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <CardView card={card} />
    </div>
  )
}