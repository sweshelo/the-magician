'use client';

import { Button } from "@/component/interface/button";
import { useWebSocket } from "@/hooks/websocket/hooks"
import { Message } from "@/submodule/suit/types/message/message";
import { useCallback, useEffect, useState } from "react";

export const RoomEntrance = () => {
  const { websocket } = useWebSocket();
  const [id, setId] = useState<string>();

  const handleSubmit = useCallback(() => {
  }, []);

  useEffect(() => {
    websocket.on('message', (message: Message) => {
      console.log(message) // TODO
    });
  }, [websocket]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <p className="text-center">ルームに参加する</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-1">
          ルームID
        </label>
        <input
          id="roomName"
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Button>参加</Button>
      </form>
    </div>
  )
}