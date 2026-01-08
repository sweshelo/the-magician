import { useWebSocket } from '@/hooks/websocket/hooks';
import { LocalStorageHelper } from '@/service/local-storage';
import {
  Message,
  RoomOpenRequestPayload,
  RoomOpenResponsePayload,
  ResponsePayload,
} from '@/submodule/suit/types';
import { useRouter } from 'next/navigation';
import { FormEvent, FormEventHandler, useCallback } from 'react';

interface Response {
  handleSubmit: FormEventHandler<HTMLFormElement>;
}

function isRoomOpenResponsePayload(payload: ResponsePayload): payload is RoomOpenResponsePayload {
  return payload.type === 'RoomOpenResponse' && 'roomId' in payload;
}

export const useRoomCreator = (): Response => {
  const { websocket } = useWebSocket();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      if (websocket == null) return;

      e.preventDefault();

      // Get form data from the event
      const formData = new FormData(e.currentTarget);
      const formValues = Object.fromEntries(formData);

      // Extract the room name
      const roomNameValue = formValues.name;
      if (typeof roomNameValue !== 'string') {
        throw new Error('Room name is required');
      }
      const roomName = roomNameValue;
      console.log('Form values:', formValues);

      try {
        const response = await websocket.request<RoomOpenRequestPayload>({
          action: {
            handler: 'server',
            type: 'open',
          },
          payload: {
            type: 'RoomOpenRequest',
            requestId: LocalStorageHelper.playerId(),
            name: roomName,
            rule: {
              system: {
                round: Number(formValues['rule.system.round']),
                draw: {
                  top: Number(formValues['rule.system.draw.top']),
                  override: Number(formValues['rule.system.draw.override']),
                  mulligan: Number(formValues['rule.system.draw.mulligan']),
                },
                handicap: {
                  draw: formValues['rule.system.handicap.draw'] === 'on',
                  cp: formValues['rule.system.handicap.cp'] === 'on',
                  attack: formValues['rule.system.handicap.attack'] === 'on',
                },
                cp: {
                  init: Number(formValues['rule.system.cp.init']),
                  increase: Number(formValues['rule.system.cp.increase']),
                  max: Number(formValues['rule.system.cp.max']),
                  ceil: Number(formValues['rule.system.cp.ceil']),
                  carryover: formValues['rule.system.cp.carryover'] === 'on',
                },
              },
              player: {
                max: {
                  life: Number(formValues['rule.player.max.life']),
                  hand: Number(formValues['rule.player.max.hand']),
                  trigger: Number(formValues['rule.player.max.trigger']),
                  field: Number(formValues['rule.player.max.field']),
                },
              },
              misc: {
                strictOverride: formValues['rule.misc.strictOverride'] === 'on',
                suicideJoker: formValues['rule.misc.suicideJoker'] === 'on',
              },
              debug: {
                enable: formValues['rule.debug.enable'] === 'on',
                reveal: {
                  opponent: {
                    deck: formValues['rule.debug.reveal.opponent.deck'] === 'on',
                    hand: formValues['rule.debug.reveal.opponent.hand'] === 'on',
                    trigger: formValues['rule.debug.reveal.opponent.trigger'] === 'on',
                    trash: formValues['rule.debug.reveal.opponent.trash'] === 'on',
                  },
                  self: {
                    deck: formValues['rule.debug.reveal.self.deck'] === 'on',
                  },
                },
              },
            },
          },
        } satisfies Message<RoomOpenRequestPayload>);

        if (!isRoomOpenResponsePayload(response.payload)) {
          throw new Error('Unexpected response type');
        }
        router.push(`/room/${response.payload.roomId}`);
      } catch (error) {
        console.error('Error creating room:', error);
        alert('ルームの作成に失敗しました。');
      }
    },
    [router, websocket]
  );

  return { handleSubmit };
};
