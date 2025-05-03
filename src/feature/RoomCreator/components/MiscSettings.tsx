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
        label="自傷ダメージでもジョーカーゲージを増加させる"
        registration={register('rule.misc.suicideJoker')}
        defaultChecked={DEFAULT_ROOM_SETTINGS.rule.misc.suicideJoker}
      />
    </SettingsGroup>
  );
};
