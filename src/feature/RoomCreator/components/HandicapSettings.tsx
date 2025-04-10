"use client";

import { SettingsGroup } from "@/app/component/interface/settingsGroup";
import { Toggle } from "@/app/component/interface/toggle";
import { UseFormRegister } from "react-hook-form";
import { RoomCreatePayload } from "../types";
import { FirstPlayerDrawToggle } from "./FirstPlayerDrawToggle";

interface HandicapSettingsProps {
  register: UseFormRegister<RoomCreatePayload>;
}

export const HandicapSettings: React.FC<HandicapSettingsProps> = ({
  register,
}) => {
  return (
    <SettingsGroup title="ハンディキャップ設定">
      <FirstPlayerDrawToggle registration={register("handicap.draw")} />
      <Toggle
        label="先攻1ターン目の攻撃を禁止する"
        registration={register("handicap.attack")}
      />
      <Toggle
        label="先攻1ターン目のCP増加を無効にする"
        registration={register("handicap.cp")}
      />
    </SettingsGroup>
  );
};
