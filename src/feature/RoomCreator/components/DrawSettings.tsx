"use client";

import { NumberInput } from "@/app/component/interface/numberInput";
import { SettingsGroup } from "@/app/component/interface/settingsGroup";
import { UseFormRegister } from "react-hook-form";
import { RoomCreatePayload } from "../types";

interface DrawSettingsProps {
  register: UseFormRegister<RoomCreatePayload>;
}

export const DrawSettings: React.FC<DrawSettingsProps> = ({ register }) => {
  return (
    <SettingsGroup title="ドロー設定">
      <NumberInput
        label="ターン開始時のドロー枚数"
        min={1}
        max={5}
        registration={register("draw.top", { valueAsNumber: true })}
      />
      <NumberInput
        label="オーバーライド"
        description="オーバーライドした際のドロー枚数"
        min={0}
        max={5}
        registration={register("draw.override", { valueAsNumber: true })}
      />
      <NumberInput
        label="マリガン枚数"
        min={0}
        max={10}
        registration={register("draw.mulligan", { valueAsNumber: true })}
      />
    </SettingsGroup>
  );
};
