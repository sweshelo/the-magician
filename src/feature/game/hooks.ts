import { useWebSocket } from "@/hooks/websocket/hooks";
import { LocalStorageHelper } from "@/service/local-storage";
import { Message, PlayerEntryPayload } from "@/submodule/suit/types";
import { useEffect, useRef, useState } from "react";

interface UseGameProps {
  id: string
}

export const useGame = ({ id }: UseGameProps) => {
  const { websocket } = useWebSocket();
  const [isConnected, setConnected] = useState(websocket?.isConnected());

  const isJoined = useRef(false);

  // ルーム参加処理
  useEffect(() => {
    if (websocket && isConnected && !isJoined.current) {
      isJoined.current = true;

      websocket?.on('message', (message: Message) => {
        console.log('recieved message on useGame hooks : %s', message.action.type)
      })

      websocket.send({
        action: {
          handler: 'room',
          type: 'join',
        },
        payload: {
          type: 'PlayerEntry',
          roomId: id,
          player: {
            name: 'Sweshelo',
            id: LocalStorageHelper.playerId(),
            deck: ['0', '0', '0', '1', '1', '1'],
          },
        }
      } satisfies Message<PlayerEntryPayload>)
    }
  }, [id, websocket, isConnected])

  useEffect(() => {
    websocket?.on('open', () => setConnected(true))
  }, [websocket])


  return {
  }
}