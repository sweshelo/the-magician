import { HandView } from '@/component/ui/HandView';
import { JokerGauge } from '@/component/ui/JokerGauge';
import { usePlayer } from '@/hooks/game/hooks';
import { LocalStorageHelper } from '@/service/local-storage';
import { Tooltip } from 'react-tooltip';

export const JokerArea = () => {
  const playerId = LocalStorageHelper.playerId();
  const player = usePlayer(playerId);

  return (
    <div className="flex flex-col gap-1">
      <JokerGauge percentage={player?.joker || 0} />
      <Tooltip id="joker">JOKERは未実装のため、利用できません</Tooltip>
      <div className={'' /* flex gap-2*/} data-tooltip-id="joker">
        <div className="pointer-events-none flex gap-2">
          <HandView key={`hand-card-jk1`} card={{ id: 'jk1', catalogId: 'ルインリード', lv: 1 }} />
          <HandView
            key={`hand-card-jk2`}
            card={{ id: 'jk2', catalogId: 'グラフィティ・アース', lv: 1 }}
          />
        </div>
      </div>
    </div>
  );
};
