'use client';

import { Button } from '@/component/interface/button';
import { useWebSocket } from '@/hooks/websocket/hooks';
import { Message } from '@/type/message';
import { PlayerEntryPayload, RoomCreatePayload, RoomCreateResponse } from '@/type/payload/server';
import { useRouter } from 'next/navigation';
import { FormEventHandler, useState } from 'react';

export const RoomCreator = () => {
  const [roomName, setRoomName] = useState('');
  const { websocket } = useWebSocket();
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    console.log(roomName);
    const response = await websocket.request<RoomCreatePayload, RoomCreateResponse>({
      action: {
        handler: 'server',
        type: 'open',
      },
      payload: {
        requestId: crypto.randomUUID(),
        name: roomName,
      }
    } satisfies Message<RoomCreatePayload>)
    console.log('response: %s', JSON.stringify(response))
    alert(response.payload.roomId)

    websocket.send({
      action: {
        handler: 'room',
        type: 'join',
      },
      payload: {
        roomId: response.payload.roomId,
        player: {
          name: 'Sweshelo',
          id: crypto.randomUUID(),
          deck: ['0', '0', '0', '1', '1', '1'],
        },
      }
    } satisfies Message<PlayerEntryPayload>)

    router.push(`/room/${response.payload.roomId}`)
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <p className="text-center">ルームを作成する</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-1">
          ルーム名
        </label>
        <input
          id="roomName"
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Button>作成</Button>
      </form>
    </div>
  );
};
