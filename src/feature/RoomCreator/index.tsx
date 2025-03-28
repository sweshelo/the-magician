'use client';

import { Button } from '@/component/interface/button';
import { useRoomCreator } from './hooks';

export const RoomCreator = () => {
  const {handleSubmit, roomName, setRoomName} = useRoomCreator();

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
          //required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Button>作成</Button>
      </form>
    </div>
  );
};
