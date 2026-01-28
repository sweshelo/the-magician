import { useWebSocketGame } from '@/hooks/game';
import { useSystemContext } from '@/hooks/system/hooks';
import { useHand, useField } from '@/hooks/game/hooks';
import { ICard, IUnit } from '@/submodule/suit/types';
import { useDndMonitor, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { useSelfId } from '@/hooks/player-identity';
import catalog from '@/submodule/suit/catalog/catalog';

export const useMyArea = () => {
  const { activeCard, setActiveCard } = useSystemContext();
  const { override, unitDrive, jokerDrive, setTrigger, discard, evolution } = useWebSocketGame();

  // Get current player ID
  const currentPlayerId = useSelfId();

  // Get player's hand and field for evolution handling
  const hand = useHand(currentPlayerId) || [];
  const field = useField(currentPlayerId) || [];
  useDndMonitor({
    onDragStart(e: DragStartEvent) {
      setActiveCard(e.active);
    },
    onDragEnd(e: DragEndEvent) {
      const { over } = e;
      const cardSource = e.active.data.current?.source;
      switch (over?.data.current?.type) {
        case 'field':
          {
            const isJokerBySource = cardSource === 'joker';
            const isJokerByType = catalog.get(e.active.data.current?.type)?.type === 'joker';
            if (isJokerBySource || isJokerByType) {
              jokerDrive({ target: activeCard?.id as string });
            } else {
              unitDrive({ target: activeCard?.id as string });
            }
          }
          break;
        case 'card':
          override({
            target: activeCard?.id as string,
            parent: over.id as string,
          });
          break;
        case 'trigger-zone':
          setTrigger({ target: { id: activeCard?.id } as ICard });
          break;
        case 'trash':
          discard({ target: { id: activeCard?.id } as ICard });
          break;
        case 'unit':
          {
            // Evolution handling
            const draggedCardId = activeCard?.id as string;
            const targetUnitId = over.data.current.unitId as string;

            // Find the corresponding card and unit
            const handCard = hand.find(card => card.id === draggedCardId) as ICard | undefined;
            const fieldUnit = field.find(unit => unit.id === targetUnitId) as IUnit | undefined;

            if (handCard && fieldUnit) {
              // Get catalog entries
              const handCardMaster = catalog.get(handCard.catalogId);

              // Check if it's an advanced_unit (already checked in UnitView's droppable config,
              // but double-checking here for safety)
              if (handCardMaster?.type === 'advanced_unit') {
                // Send evolution action to server
                evolution({
                  source: fieldUnit,
                  target: handCard,
                });
              }
            }
          }
          break;
        default:
          break;
      }
      setActiveCard(undefined);
    },
  });
};
