"use client";

import { SettingsGroup } from "@/app/component/interface/settingsGroup";
import { Toggle } from "@/app/component/interface/toggle";
import { UseFormRegister } from "react-hook-form";
import { RoomCreatePayload } from "../types";

interface MiscSettingsProps {
  register: UseFormRegister<RoomCreatePayload>;
}

export const MiscSettings: React.FC<MiscSettingsProps> = ({ register }) => {
  return (
    <SettingsGroup title="その他の設定">
      <Toggle
        label="ストリクトオーバーライド"
        description="カード名だけでなく、バージョン名もチェック対象とする"
        tooltipId="strict-override"
        registration={register("misc.strictOverride")}
      />
      <Toggle
        label="自傷ダメージでもジョーカーゲージを増加させる"
        registration={register("misc.suicideJoker")}
      />
    </SettingsGroup>
  );
};
