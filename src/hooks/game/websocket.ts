'use client'

import { useCallback } from "react";
import { useWebSocket } from "../websocket/hooks";
import { ContinuePayload, Message, OverridePayload, UnitDrivePayload } from "@/submodule/suit/types";
import { LocalStorageHelper } from "@/service/local-storage";

export const useWebSocketGame = () => {
  const { websocket } = useWebSocket();

  const send = useCallback((message: Message) => {
    if (websocket) {
      websocket?.send(message)
    } else {
      console.error('WebSocket接続確立前に send が呼び出されました。')
    }
  }, [websocket])

  interface OverrideProps {
    target: string
    parent: string
  }
  const override = useCallback(({ target, parent }: OverrideProps) => {
    const message: Message<OverridePayload> = {
      action: {
        type: 'game',
        handler: 'core'
      },
      payload: {
        type: 'Override',
        parent: { id: parent },
        target: { id: target },
        player: LocalStorageHelper.playerId()
      }
    }
    send(message)
  }, [send])

  interface UnitDriveProps {
    target: string
  }
  const unitDrive = useCallback(({ target }: UnitDriveProps) => {
    const message: Message<UnitDrivePayload> = {
      action: {
        type: 'game',
        handler: 'core',
      },
      payload: {
        type: 'UnitDrive',
        target: { id: target },
        player: LocalStorageHelper.playerId(),
      }
    }
    send(message)
  }, [send])

  interface ContinueProps {
    promptId: string
  }
  const continueGame = useCallback(({ promptId }: ContinueProps) => {
    const message: Message<ContinuePayload> = {
      action: {
        type: 'game',
        handler: 'core',
      },
      payload: {
        type: 'Continue',
        promptId,
        player: LocalStorageHelper.playerId(),
      }
    }
    send(message)
  }, [send])

  const choose = useCallback(({ promptId, choice }: { promptId: string, choice: string[] }) => {
    const message: Message = {
      action: {
        type: 'game',
        handler: 'core',
      },
      payload: {
        type: 'Choose',
        promptId,
        choice,
      }
    }
    send(message)
  }, [send])

  return { send, override, unitDrive, continueGame, choose }
}
