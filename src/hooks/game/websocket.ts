'use client';

import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "../websocket/hooks";
import { LocalStorageHelper } from "@/service/local-storage";
import { Message, PlayerEntryPayload } from "@/submodule/suit/types";

interface Props {
  id: string
}

export const useWebSocketGame = ({ id }: Props) => {
  const { websocket } = useWebSocket();
  const [isConnected, setConnected] = useState<boolean>(false);
  const isJoined = useRef(false);
  // ルーム参加処理
  useEffect(() => {
    console.log('hello')
    if (websocket && isConnected && !isJoined.current && id) {
      isJoined.current = true;
      // websocket?.on('message', (message: Message) => {
      //   messageHandler(message)
      // })
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
    console.log('websocket init')
    websocket?.on('open', () => setConnected(true))
  }, [websocket])
}