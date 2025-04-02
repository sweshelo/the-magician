import { useHandler } from "@/hooks/game/handler";
import { useWebSocket } from "@/hooks/websocket/hooks";
import { LocalStorageHelper } from "@/service/local-storage";
import { Message, PlayerEntryPayload } from "@/submodule/suit/types";
import { useEffect, useRef, useState } from "react";

interface Props {
  id: string
}
export const useGameComponentHook = ({ id }: Props) => {
  const { websocket } = useWebSocket();
  const [isConnected, setConnected] = useState<boolean>(websocket?.isConnected() ?? false);
  const isJoined = useRef(false);
  const { handle } = useHandler();

  // ルーム参加処理
  useEffect(() => {
    if (websocket && isConnected && !isJoined.current && id) {
      isJoined.current = true;
      websocket?.on('message', (message: Message) => {
        handle(message)
      })
      websocket.send({
        action: {
          handler: 'room',
          type: 'join'
        },
        payload: {
          type: 'PlayerEntry',
          roomId: id,
          player: {
            name: 'Sweshelo',
            id: LocalStorageHelper.playerId(),
            deck: [
              '1-0-040',
              '2-1-051', '2-1-051', '2-1-051',
              '2-2-057', '2-2-057', '2-2-057',
              '2-0-148', '2-0-148', '2-0-148',
              '1-4-041', '1-4-041', '1-4-041',
              '2-0-025', '2-0-025', '2-0-025',
              '2-0-121', '2-0-121', '2-0-121',
              'SP-012', 'SP-012', 'SP-012',
              '2-0-038', '2-0-038', '2-0-038',
              '2-0-007', '2-0-007', '2-0-007',
              '2-0-019', '2-0-019', '2-0-019',
              'SP-016', 'SP-016', 'SP-016',
              'SP-005', 'SP-005', 'SP-005',
              'SP-001', 'SP-001', 'SP-001',
              '2-3-240',
            ],
          },
        }
      } satisfies Message<PlayerEntryPayload>)
    }
  }, [id, websocket, isConnected, handle])

  useEffect(() => {
    if (websocket) {
      // Set initial state based on current connection state
      setConnected(websocket.isConnected());

      // Set up listener for future state changes
      websocket.on('open', () => setConnected(true));
      websocket.on('close', () => setConnected(false));
    }
  }, [websocket])
}
