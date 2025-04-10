import { useWebSocketGame } from "@/hooks/game";
import { useSoundEffect } from "@/hooks/sound/hooks";
import { useSystemContext } from "@/hooks/system/hooks";
import { ICard } from "@/submodule/suit/types";
import { useDndMonitor, DragStartEvent, DragEndEvent } from "@dnd-kit/core";

export const useMyArea = () => {
  const { activeCard, setActiveCard } = useSystemContext();
  const { override, unitDrive, setTrigger } = useWebSocketGame();
  const { trash, clockUp, draw, drive, trigger } = useSoundEffect();
  useDndMonitor({
    onDragStart(e: DragStartEvent) {
      setActiveCard(e.active);
    },
    onDragEnd(e: DragEndEvent) {
      const { over } = e;
      console.log(over);
      switch (over?.data.current?.type) {
        case "field":
          unitDrive({ target: activeCard?.id as string });
          drive();
          break;
        case "card":
          override({
            target: activeCard?.id as string,
            parent: over.id as string,
          });
          trash();
          clockUp();
          draw();
          break;
        case "trigger-zone":
          setTrigger({ target: { id: activeCard?.id } as ICard });
          trigger();
          break;
        default:
          break;
      }
      setActiveCard(undefined);
    },
  });
};
