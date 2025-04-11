"use client";

import { NumberInput } from "@/app/component/interface/numberInput";
import { SettingsGroup } from "@/app/component/interface/settingsGroup";
import { UseFormRegister } from "react-hook-form";
import { RoomCreatorFormParams } from "../type";

interface MaxSettingsProps {
  register: UseFormRegister<RoomCreatorFormParams>;
}

export const MaxSettings: React.FC<MaxSettingsProps> = ({ register }) => {
  return (
    <SettingsGroup title="上限設定">
      <NumberInput
        label="最大ラウンド数"
        min={1}
        max={30}
        registration={register("rule.system.round", { valueAsNumber: true })}
      />
    </SettingsGroup>
  );
};
