"use client";

import { NumberInput } from "@/app/component/interface/numberInput";
import { SettingsGroup } from "@/app/component/interface/settingsGroup";
import { Toggle } from "@/app/component/interface/toggle";
import { UseFormRegister } from "react-hook-form";
import { RoomCreatorFormParams } from "../type";

interface CpSettingsProps {
  register: UseFormRegister<RoomCreatorFormParams>;
}

export const CpSettings: React.FC<CpSettingsProps> = ({ register }) => {
  return (
    <SettingsGroup title="CP設定">
      <NumberInput
        label="初期CP"
        description="ゲーム開始時のCP"
        min={0}
        max={10}
        registration={register("rule.system.cp.init", { valueAsNumber: true })}
      />
      <NumberInput
        label="ターンごとのCP増加量"
        description="ターン開始時に増加するCP (総増加量: 初期値 + ラウンド数 × 増加量 ≦ 最大値)"
        min={0}
        max={5}
        registration={register("rule.system.cp.increase", { valueAsNumber: true })}
      />
      <NumberInput
        label="CP最大値"
        description="ターン開始時に増加するCPの最大値"
        min={1}
        max={20}
        registration={register("rule.system.cp.max", { valueAsNumber: true })}
      />
      <NumberInput
        label="CP上限"
        description="ストック可能なCPの最大値"
        min={1}
        max={20}
        registration={register("rule.system.cp.ceil", { valueAsNumber: true })}
      />
      <Toggle
        label="CPの持ち越し"
        description="未使用のCPを次のラウンドに持ち越せるようにする"
        registration={register("rule.system.cp.carryover")}
      />
    </SettingsGroup>
  );
};
