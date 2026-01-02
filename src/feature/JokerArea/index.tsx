import { CardView } from '@/component/ui/CardView';
import { HandView } from '@/component/ui/HandView';
import { JokerGauge } from '@/component/ui/JokerGauge';
import { usePlayer } from '@/hooks/game/hooks';
import { LocalStorageHelper } from '@/service/local-storage';

export const JokerArea = () => {
  const playerId = LocalStorageHelper.playerId();
  const player = usePlayer(playerId);

  return (
    <div className="flex flex-col gap-1">
      <JokerGauge percentage={player?.joker.gauge || 0} />
      <div className="flex gap-2">
        {(player?.joker.card || []).map(card => (
          <div key={card.id} className={`relative`}>
            {card.isAvailable ? (
              <HandView card={card} source="joker" />
            ) : (
              <>
                <div className="absolute inset-0 bg-black opacity-50 z-10 pointer-events-none" />
                <CardView card={card} />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
