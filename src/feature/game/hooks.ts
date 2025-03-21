import { useWebSocket } from "@/hooks/websocket/hooks";
import { Message, PlayerEntryPayload } from "@/submodule/suit/types";
import { useEffect } from "react";

interface UseGameProps {
  id: string
}

export const useGame = ({ id }: UseGameProps) => {
  const { websocket } = useWebSocket();
  
  // ルーム参加処理
  useEffect(() => {
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
          id: crypto.randomUUID(),
          deck: ['0', '0', '0', '1', '1', '1'],
        },
      }
    } satisfies Message<PlayerEntryPayload>)
  })

  websocket.on('message', (message: Message) => {
    console.log('recieved message on useGame hooks : %s', message.action.type)
  })

  return {
  }
}