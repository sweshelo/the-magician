'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { useWebSocket } from "../websocket/hooks";
import { LocalStorageHelper } from "@/service/local-storage";
import { Message, PlayerEntryPayload } from "@/submodule/suit/types";
import { useHandler } from "./handler";

interface Props {
  id: string
}

export const useWebSocketGame = ({ id }: Props) => {
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
              '1-0-001', '1-0-001', '1-0-001',
              '1-0-001', '1-0-001', '1-0-001',
              '1-0-001', '1-0-001', '1-0-001',
              '1-0-001', '1-0-001', '1-0-001',
              '1-0-001', '1-0-001', '1-0-001',
              '1-0-001', '1-0-001', '1-0-001',
              '1-0-001', '1-0-001', '1-0-001',
              '1-0-001', '1-0-001', '1-0-001',
              '1-0-001', '1-0-001', '1-0-001',
              '1-0-001', '1-0-001', '1-0-001',
              '1-0-001', '1-0-001', '1-0-001',
              '1-0-001', '1-0-001', '1-0-001',
              '1-0-001', '1-0-001', '1-0-001',
              '2-3-128',
            ],
          },
        }
      } satisfies Message<PlayerEntryPayload>)
    }
  }, [id, websocket, isConnected, handle])

  useEffect(() => {
    websocket?.on('open', () => setConnected(true))
  }, [websocket])

  const send = useCallback((message: Message) => {
    if (websocket) {
      websocket?.send(message)
    } else {
      console.error('WebSocket接続確立前に send が呼び出されました。')
    }
  }, [websocket])

  return { send }
}
