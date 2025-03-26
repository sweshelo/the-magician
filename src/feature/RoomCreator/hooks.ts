import { useWebSocket } from '@/hooks/websocket/hooks'
import { LocalStorageHelper } from '@/service/local-storage'
import { Message, RoomOpenRequestPayload, RoomOpenResponsePayload } from '@/submodule/suit/types'
import { useRouter } from 'next/navigation'
import { Dispatch, FormEvent, FormEventHandler, SetStateAction, useCallback, useState } from 'react'

interface Response {
  setRoomName: Dispatch<SetStateAction<string>>
  roomName: string
  handleSubmit: FormEventHandler<HTMLFormElement>
}
export const useRoomCreator = (): Response => {
  const [roomName, setRoomName] = useState('')
  const { websocket } = useWebSocket()
  const router = useRouter()

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    if (websocket == null) return

    e.preventDefault()
    console.log(roomName)
    const response = await websocket.request<RoomOpenRequestPayload, RoomOpenResponsePayload>({
      action: {
        handler: 'server',
        type: 'open'
      },
      payload: {
        type: 'RoomOpenRequest',
        requestId: LocalStorageHelper.playerId(),
        name: roomName
      }
    } satisfies Message<RoomOpenRequestPayload>)
    router.push(`/room/${response.payload.roomId}`)
  }, [roomName, router, websocket])

  return { setRoomName, roomName, handleSubmit }
}
