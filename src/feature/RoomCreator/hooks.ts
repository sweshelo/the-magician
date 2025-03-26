import { useWebSocket } from '@/hooks/websocket/hooks';
import { LocalStorageHelper } from '@/service/local-storage';
import { Message } from '@/submodule/suit/types';
import { RoomOpenRequestPayload, RoomOpenResponsePayload } from '@/submodule/suit/types';
import { useRouter } from 'next/navigation';
import { FormEventHandler, useCallback, useState } from 'react';

export const useRoomCreator = () => {
  const [roomName, setRoomName] = useState('');
  const { websocket } = useWebSocket();
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(async (e) => {
    if (!websocket) return;

    e.preventDefault();
    const response = await websocket.request<RoomOpenRequestPayload, RoomOpenResponsePayload>({
      action: {
        handler: 'server',
        type: 'open',
      },
      payload: {
        type: 'RoomOpenRequest',
        requestId: LocalStorageHelper.playerId(),
        name: roomName,
      }
    } satisfies Message<RoomOpenRequestPayload>)
    router.push(`/room/${response.payload.roomId}`)
  }, [roomName, router, websocket]);

  return { setRoomName, roomName, handleSubmit }
}