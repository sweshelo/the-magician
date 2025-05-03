'use client';

import { NumberInput } from '@/component/interface/numberInput';
import { SettingsGroup } from '@/component/interface/settingsGroup';
import { UseFormRegister } from 'react-hook-form';
import { RoomCreatorFormParams } from '../type';
import { DEFAULT_ROOM_SETTINGS } from '../../../constants/room';

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
        defaultValue={DEFAULT_ROOM_SETTINGS.rule.system.round}
        registration={register('rule.system.round', { valueAsNumber: true })}
      />
    </SettingsGroup>
  );
};
