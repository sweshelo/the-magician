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
      supports: [card.catalogId]
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

  const { setSelectedCard } = useSystemContext();
  const handleCardClick = useCallback(() => {
    if (card.catalogId) setSelectedCard(card)
  }, [card, setSelectedCard])

  useEffect(() => {
    setHighlighted(activeCard?.id !== card.id && activeCard?.data.current?.type === card.catalogId)
  }, [activeCard?.data, activeCard?.id, card.catalogId, card.id])

  return (
    <div
      className="relative"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleCardClick}
    >
      <div className="relative">
        <div className={(isHighlighted && isOver) ? `animate-pulse-border`: ''}>
          <CardView card={card} />
        </div>
        {isHighlighted && (
          <div className="absolute inset-0 border-1 border-gray-300 animate-pulse-border shadow-glow pointer-events-none" />
        )}
      </div>
    </div>
  )
}
