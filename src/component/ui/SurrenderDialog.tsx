import React, { useCallback } from 'react';
import { useWebSocketGame } from '@/hooks/game/websocket';
import { useSoundV2 } from '@/hooks/soundV2';
import { Message, createMessage } from '@/submodule/suit/types';
import { useSelfId } from '@/hooks/player-identity';
import { useSystemContext } from '@/hooks/system/hooks';

interface SurrenderDialogProps {
  onClose: () => void;
}

export const SurrenderDialog: React.FC<SurrenderDialogProps> = ({ onClose }) => {
  const { send } = useWebSocketGame();
  const { play } = useSoundV2();
  const { operable } = useSystemContext();
  const selfId = useSelfId();

  const handleYes = useCallback(() => {
    const message: Message = createMessage({
      action: {
        type: 'game',
        handler: 'core',
      },
      payload: {
        type: 'Surrender',
        player: selfId,
      },
    });
    send(message);
    play('decide');
    onClose();
  }, [send, play, selfId, onClose]);

  const handleNo = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!operable) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg z-50">
      <div className="flex flex-col items-center p-4">
        <div className="text-white text-lg mb-4">サレンダーしますか？</div>
        <div className="flex gap-5">
          <button
            className="bg-red-600 text-white py-2 px-5 border-0 rounded cursor-pointer hover:bg-red-700"
            onClick={handleYes}
          >
            はい
          </button>
          <button
            className="bg-blue-600 text-white py-2 px-5 border-0 rounded cursor-pointer hover:bg-blue-700"
            onClick={handleNo}
          >
            いいえ
          </button>
        </div>
      </div>
    </div>
  );
};
