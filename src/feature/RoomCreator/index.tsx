"use client";

import { Button } from "@/component/interface/button";
import { useForm } from "react-hook-form";
import { Tooltip } from "react-tooltip";
import { useRoomCreator } from "./hooks";
import { RoomCreatePayload } from "./types";

// Import components
import { HandicapSettings } from "./components/HandicapSettings";
import { MaxSettings } from "./components/MaxSettings";
import { DrawSettings } from "./components/DrawSettings";
import { CpSettings } from "./components/CpSettings";
import { PlayerSettings } from "./components/PlayerSettings";
import { DebugSettings } from "./components/DebugSettings";
import { MiscSettings } from "./components/MiscSettings";

export const RoomCreator = () => {
  const { handleSubmit: handleRoomSubmit } = useRoomCreator();

  const {
    register,
    formState: { errors },
  } = useForm<RoomCreatePayload>({
    defaultValues: {
      handicap: {
        draw: true,
        attack: true,
        cp: true,
      },
      misc: {
        strictOverride: false,
        suicideJoker: false,
      },
      max: {
        round: 10,
        field: 5,
      },
      draw: {
        top: 2,
        override: 1,
        mulligan: 4,
      },
      strictOverride: false,
      cp: {
        init: 2,
        increase: 1,
        max: 7,
        ceil: 12,
        carryover: false,
      },
      player: {
        life: 8,
        hand: 7,
        trigger: 4,
      },
      debug: {
        enable: false,
        reveal: {
          opponent: {
            deck: true,
            hand: true,
            trigger: true,
            trash: true,
          },
          self: {
            deck: true,
          },
        },
      },
    },
  });

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-center text-xl font-bold mb-4">ルームを作成する</h2>
      <form onSubmit={handleRoomSubmit} className="space-y-4">
        <div className="mb-4">
          <label
            htmlFor="roomName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            ルーム名
          </label>
          <input
            id="roomName"
            type="text"
            {...register("name", { required: "ルーム名は必須です" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <HandicapSettings register={register} />
        <MaxSettings register={register} />
        <DrawSettings register={register} />
        <CpSettings register={register} />
        <PlayerSettings register={register} />
        <MiscSettings register={register} />
        <DebugSettings register={register} />

        <Button>作成</Button>
      </form>
      <Tooltip id="strict-override">
        <span>
          このオプションを有効にすると、カード名だけでなくバージョン名などもチェック対象となります。
          <br />
          例えば、PR『見習い魔道士リーナ』・SP『見習い魔道士リーナ』・V1.0『見習い魔道士リーナ』は、
          <br />
          それぞれ異なるカードであると見なされ、オーバーライドできません。
        </span>
      </Tooltip>
    </div>
  );
};
