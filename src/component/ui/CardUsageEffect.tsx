'use client';

import { useCardUsageEffect } from '@/hooks/card-usage-effect';
import './CardUsageEffect.css';

export const CardUsageEffect = () => {
  const { state } = useCardUsageEffect();
  const { isVisible, imageUrl, type, position, phase } = state;

  if (!isVisible) return null;

  const positionClasses = {
    left: 'left-35',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-35'
  };

  const positionClass = positionClasses[position];

  return (
    <div className={`fixed z-10 top-1/3 ${positionClass} pointer-events-none`}>
      <div className="relative">
        {/* Card Image */}
        <div
          className={`w-32 h-44 rounded card-image phase-${phase}`}
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transformOrigin: 'center center', // Always scale from center
            boxShadow: '0 0 15px 5px rgba(255, 255, 255, 0.7)', // Rich white shadow
            // Add initial styles directly to ensure they apply
            opacity: phase === 'phase1' ? 0 : phase === 'phase2' ? 1 : phase === 'phase3' ? 0 : 1,
            transform: phase === 'phase1'
              ? 'scale(3)'
              : phase === 'phase2'
                ? 'scale(2)'
                : phase === 'phase3'
                  ? 'scale(2) translateY(-50px)'
                  : 'scale(2)'
          }}
        />

        {/* Drive Text */}
        <div
          className={`absolute bottom-18 drive-text phase-${phase}`}
          style={{
            transform: phase === 'phase1'
              ? 'translateX(-100%)'
              : phase === 'phase2'
                ? 'translateX(-25%)'
                : 'translateX(100%)',  // Move right while disappearing
            opacity: phase === 'phase3' ? 0 : 1
          }}
        >
          <div className="flex items-center justify-center gap-2 bg-black/70 px-4 py-5 px-10 rounded text-white text-3xl font-bold">
            <span className="text-yellow-400">{type}</span>
            <span>DRIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
