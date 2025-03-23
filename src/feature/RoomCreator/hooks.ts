import { useWebSocket } from '@/hooks/websocket/hooks';
import { Message } from '@/submodule/suit/types';
import { RoomOpenRequestPayload, RoomOpenResponsePayload } from '@/submodule/suit/types';
import { useRouter } from 'next/navigation';
import { FormEventHandler, useState } from 'react';

export const useRoomCreator = () => {
  const [roomName, setRoomName] = useState('');
  const { websocket } = useWebSocket();
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    console.log(roomName);
    const response = await websocket.request<RoomOpenRequestPayload, RoomOpenResponsePayload>({
      action: {
        handler: 'server',
        type: 'open',
      },
      payload: {
        type: 'RoomOpenRequest',
        requestId: crypto.randomUUID(),
        name: roomName,
      }
    } satisfies Message<RoomOpenRequestPayload>)
    console.log('response: %s', JSON.stringify(response))
    alert(response.payload.roomId)

    router.push(`/room/${response.payload.roomId}`)
  };

  return { setRoomName, roomName, handleSubmit }
}