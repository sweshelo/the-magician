import { useGameContext } from "@/hooks/game/hooks";
import { useWebSocket } from "@/hooks/websocket/hooks";
import { LocalStorageHelper } from "@/service/local-storage";
import { Message, PlayerEntryPayload, SyncPayload } from "@/submodule/suit/types";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseGameProps {
  id: string
}

export const useGame = ({ id }: UseGameProps) => {
  const { websocket } = useWebSocket();
  const { setTurn, setRound } = useGameContext();
  const [isConnected, setConnected] = useState(websocket?.isConnected());
  const isJoined = useRef(false);

  const sync = useCallback((state: SyncPayload['body']) => {
    // TODO: 他のStateも更新する
    setTurn(state.game.turn)
    setRound(state.game.round)
  }, [setRound, setTurn])

  const messageHandler = useCallback((message: Message) => {
    console.log('recieved message on useGame hooks : %s', message.action.type)
    switch (message.payload.type) {
      case 'Sync': {
        const { body } = message.payload
        sync(body);
        break;
      }
    }
  }, [sync])

  // ルーム参加処理
  useEffect(() => {
    if (websocket && isConnected && !isJoined.current) {
      isJoined.current = true;

      websocket?.on('message', (message: Message) => {
        messageHandler(message)
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
  }, [id, websocket, isConnected, messageHandler])

  useEffect(() => {
    websocket?.on('open', () => setConnected(true))
  }, [websocket])


  return {
  }
}