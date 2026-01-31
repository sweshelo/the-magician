import { getJokerGaugePercentage } from '@/helper/game';
import type { IJoker } from '@/submodule/suit/types/game/joker';

interface JokerGaugeProps {
  percentage: number; // 0-100
  jokers?: IJoker[];
}

export const JokerGauge = ({ percentage, jokers }: JokerGaugeProps) => {
  // Ensure percentage is between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  // Get gauge thresholds for each joker
  const firstJokerThreshold = jokers?.[0] ? getJokerGaugePercentage(jokers[0]) : undefined;
  const secondJokerThreshold = jokers?.[1] ? getJokerGaugePercentage(jokers[1]) : undefined;

  return (
    <div className="relative w-58 h-5 bg-black rounded-sm border border-gray-600">
      {/* Gradient fill */}
      <div
        className="h-full rounded-sm bg-gradient-to-r from-red-800 to-red-400 transition-all duration-300"
        style={{ width: `${clampedPercentage}%` }}
      />

      {/* 25% interval markers */}
      <div className="absolute inset-0 flex justify-between items-center px-1">
        {[0, 25, 50, 75, 100].map(mark => (
          <div key={mark} className="w-0.5 h-3 bg-white opacity-70" />
        ))}
      </div>

      {/* 1st JOKER threshold indicator - downward triangle above the gauge */}
      {firstJokerThreshold !== undefined && (
        <div
          className="absolute -top-2 -translate-x-1/2"
          style={{ left: `${firstJokerThreshold}%` }}
        >
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-cyan-500" />
        </div>
      )}

      {/* 2nd JOKER threshold indicator - upward triangle below the gauge */}
      {secondJokerThreshold !== undefined && (
        <div
          className="absolute -bottom-2 -translate-x-1/2"
          style={{ left: `${secondJokerThreshold}%` }}
        >
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-yellow-500" />
        </div>
      )}
    </div>
  );
};
