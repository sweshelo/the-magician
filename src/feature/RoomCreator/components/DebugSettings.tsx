"use client";

import { SettingsGroup } from "@/app/component/interface/settingsGroup";
import { Toggle } from "@/app/component/interface/toggle";
import { UseFormRegister } from "react-hook-form";
import { RoomCreatePayload } from "../types";

interface DebugSettingsProps {
  register: UseFormRegister<RoomCreatePayload>;
}

export const DebugSettings: React.FC<DebugSettingsProps> = ({ register }) => {
  return (
    <SettingsGroup title="デバッグ設定">
      <Toggle
        label="デバッグモード"
        description="デバッグ機能を有効にする"
        registration={register("debug.enable")}
      />

      <div className="mt-3 mb-1 text-sm font-medium text-gray-700">
        カード情報の表示
      </div>

      <div className="pl-3 border-l-2 border-gray-200 mb-3">
        <div className="mb-2 text-sm font-medium text-gray-700">相手の情報</div>
        <div>
          <span className="text-xs text-gray-500 mb-2">
            以下の設定はデバッグモードを有効にしている場合にのみ反映されます。それ以外の場合では通常のルールと同様になります。
          </span>
        </div>
        <div className="pl-3">
          <Toggle
            label="デッキを公開"
            registration={register("debug.reveal.opponent.deck")}
          />
          <Toggle
            label="手札を公開"
            registration={register("debug.reveal.opponent.hand")}
          />
          <Toggle
            label="トリガーゾーンを公開"
            registration={register("debug.reveal.opponent.trigger")}
          />
        </div>

        <div className="mb-2 text-sm font-medium text-gray-700">自分の情報</div>
        <div className="pl-3">
          <Toggle
            label="デッキを公開"
            registration={register("debug.reveal.self.deck")}
          />
        </div>
      </div>
    </SettingsGroup>
  );
};
