import { useWebSocket } from "@/hooks/websocket/hooks";
import { LocalStorageHelper } from "@/service/local-storage";
import {
  Message,
  RoomOpenRequestPayload,
  RoomOpenResponsePayload,
} from "@/submodule/suit/types";
import { useRouter } from "next/navigation";
import { FormEvent, FormEventHandler, useCallback } from "react";

interface Response {
  handleSubmit: FormEventHandler<HTMLFormElement>;
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
      const roomName = formValues.name as string;

      if (!roomName) {
        alert("ルーム名は必須です");
        return;
      }

      console.log("Form values:", formValues);

      try {
        const response = await websocket.request<
          RoomOpenRequestPayload,
          RoomOpenResponsePayload
        >({
          action: {
            handler: "server",
            type: "open",
          },
          payload: {
            type: "RoomOpenRequest",
            requestId: LocalStorageHelper.playerId(),
            name: roomName,
            // If backend API supports rule settings, uncomment and implement:
            // rule: {
            //   system: {
            //     round: Number(formValues['max.round']),
            //     draw: {
            //       top: Number(formValues['draw.top']),
            //       override: Number(formValues['draw.override']),
            //     },
            //     handicap: {
            //       draw: Boolean(formValues['handicap.draw']),
            //       cp: Boolean(formValues['handicap.cp']),
            //     },
            //     cp: {
            //       init: Number(formValues['cp.init']),
            //       increase: Number(formValues['cp.increase']),
            //     },
            //   },
            //   player: {
            //     max: {
            //       life: Number(formValues['player.life']),
            //       hand: Number(formValues['player.hand']),
            //       trigger: Number(formValues['player.trigger']),
            //       field: Number(formValues['max.field']),
            //       cp: Number(formValues['cp.ceil']),
            //     },
            //   },
            // },
          },
        } satisfies Message<RoomOpenRequestPayload>);

        router.push(`/room/${response.payload.roomId}`);
      } catch (error) {
        console.error("Error creating room:", error);
        alert("ルームの作成に失敗しました。");
      }
    },
    [router, websocket],
  );

  return { handleSubmit };
};
