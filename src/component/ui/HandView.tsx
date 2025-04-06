import { useSystemContext } from "@/hooks/system/hooks";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useCallback, useEffect, useState } from "react";
import { CardView } from "./CardView";
import { ICard } from "@/submodule/suit/types";

interface Props {
  card: ICard;
  isHighlighted?: boolean;
}

export const HandView = ({ card }: Props) => {
  const [isHighlighted, setHighlighted] = useState(false);
  const { operable, activeCard } = useSystemContext()
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
      supports: [card.catalogId],
      type: 'card',
    }
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: transform ? 1 : 0,
  };

  const setNodeRef = useCallback((ref: HTMLElement | null) => {
    setDraggableRef(ref)
    setDroppableRef(ref)
  }, [setDraggableRef, setDroppableRef])

  useEffect(() => {
    setHighlighted(activeCard?.id !== card.id && activeCard?.data.current?.type === card.catalogId)
  }, [activeCard?.data, activeCard?.id, card.catalogId, card.id])

  return (
    <div
      className={`relative ${activeCard?.id === card.id && 'opacity-75'}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <CardView
        card={card}
        isHighlighting={isHighlighted}
        isSelecting={isOver}
      />
    </div>
  )
}
