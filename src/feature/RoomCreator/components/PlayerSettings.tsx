"use client";

import { NumberInput } from "@/app/component/interface/numberInput";
import { SettingsGroup } from "@/app/component/interface/settingsGroup";
import { UseFormRegister } from "react-hook-form";
import { RoomCreatePayload } from "../types";

interface PlayerSettingsProps {
  register: UseFormRegister<RoomCreatePayload>;
}

export const PlayerSettings: React.FC<PlayerSettingsProps> = ({ register }) => {
  return (
    <SettingsGroup title="プレイヤー設定">
      <NumberInput
        label="ライフ"
        description="初期ライフポイント"
        min={1}
        max={20}
        registration={register("player.life", { valueAsNumber: true })}
      />
      <NumberInput
        label="手札の上限"
        description="最大手札枚数 ※何枚でもプレイには問題ありませんが12枚以上にするとUIが崩れます"
        min={1}
        max={15}
        registration={register("player.hand", { valueAsNumber: true })}
      />
      <NumberInput
        label="トリガーの上限"
        description="セット可能なトリガーの最大枚数"
        min={0}
        max={10}
        registration={register("player.trigger", { valueAsNumber: true })}
      />
    </SettingsGroup>
  );
};
