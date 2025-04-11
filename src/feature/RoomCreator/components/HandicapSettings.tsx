"use client";

import { SettingsGroup } from "@/app/component/interface/settingsGroup";
import { Toggle } from "@/app/component/interface/toggle";
import { UseFormRegister } from "react-hook-form";
import { RoomCreatorFormParams } from "../type";

interface HandicapSettingsProps {
  register: UseFormRegister<RoomCreatorFormParams>;
}

export const HandicapSettings: React.FC<HandicapSettingsProps> = ({
  register,
}) => {
  return (
    <SettingsGroup title="ハンディキャップ設定">
      <Toggle
        label="先攻1ターン目のドローを無効にする"
        registration={register("rule.system.handicap.draw")}
      />
      <Toggle
        label="先攻1ターン目の攻撃を禁止する"
        registration={register("rule.system.handicap.attack")}
      />
      <Toggle
        label="先攻1ターン目のCP増加を無効にする"
        registration={register("rule.system.handicap.cp")}
      />
    </SettingsGroup>
  );
};
