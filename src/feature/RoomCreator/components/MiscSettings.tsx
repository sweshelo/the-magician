'use client';

import { SettingsGroup } from '@/component/interface/settingsGroup';
import { Toggle } from '@/component/interface/toggle';
import { UseFormRegister } from 'react-hook-form';
import { RoomCreatorFormParams } from '../type';
import { DEFAULT_ROOM_SETTINGS } from '../../../constants/room';

interface MiscSettingsProps {
  register: UseFormRegister<RoomCreatorFormParams>;
}

export const MiscSettings: React.FC<MiscSettingsProps> = ({ register }) => {
  return (
    <SettingsGroup title="その他の設定">
      <Toggle
        label="ストリクトオーバーライド"
        description="カード名だけでなく、バージョン名もチェック対象とする"
        tooltipId="strict-override"
        registration={register('rule.misc.strictOverride')}
        defaultChecked={DEFAULT_ROOM_SETTINGS.rule.misc.strictOverride}
      />
      <Toggle
        label="タイマー強制"
        description="タイマーが0になると自動でターン終了/マリガン確定になります"
        tooltipId="auto-end-on-timeout"
        registration={register('rule.misc.autoEndOnTimeout')}
        defaultChecked={DEFAULT_ROOM_SETTINGS.rule.misc.autoEndOnTimeout}
      />
      <Toggle
        label="コスト分のダメージ"
        description="[ロケテスト時の仕様] プレイヤーアタックによって受けるライフがユニットのコストと等しくなります"
        tooltipId="damage-cost"
        registration={register('rule.misc.damageAsCost')}
        defaultChecked={DEFAULT_ROOM_SETTINGS.rule.misc.damageAsCost}
      />
    </SettingsGroup>
  );
};
