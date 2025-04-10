"use client";

import { NumberInput } from "@/app/component/interface/numberInput";
import { SettingsGroup } from "@/app/component/interface/settingsGroup";
import { UseFormRegister } from "react-hook-form";
import { RoomCreatePayload } from "../types";

interface MaxSettingsProps {
  register: UseFormRegister<RoomCreatePayload>;
}

export const MaxSettings: React.FC<MaxSettingsProps> = ({ register }) => {
  return (
    <SettingsGroup title="上限設定">
      <NumberInput
        label="最大ラウンド数"
        min={1}
        max={30}
        registration={register("max.round", { valueAsNumber: true })}
      />
      <NumberInput
        label="最大ユニット数"
        description="フィールドに出すことが出来るユニットの最大数"
        min={1}
        max={10}
        registration={register("max.field", { valueAsNumber: true })}
      />
    </SettingsGroup>
  );
};
