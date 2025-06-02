'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelectEffect } from '@/hooks/select-effect';

interface SelectEffectProps {
  unitId: string;
  onComplete?: () => void;
}

export const SelectEffect: React.FC<SelectEffectProps> = ({ unitId, onComplete }) => {
  // 選択エフェクトコンテキストを使用
  const { removeTargetUnit } = useSelectEffect();
  // フェーズ状態の管理
  const [phase, setPhase] = useState<'initial' | 'appear' | 'expand' | 'pulse' | 'fadeOut'>(
    'initial'
  );
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // フェーズ管理の実装
  useEffect(() => {
    // タイムアウトをクリア
    const clearTimeouts = () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };

    clearTimeouts(); // 既存のタイムアウトをクリア

    // フェーズに応じたタイムアウト設定
    let timeout: NodeJS.Timeout;

    if (phase === 'initial') {
      // 初期フェーズからappearへ
      timeout = setTimeout(() => setPhase('appear'), 0);
      timeoutsRef.current.push(timeout);
    } else if (phase === 'appear') {
      // 表示フェーズからexpandへ
      timeout = setTimeout(() => setPhase('expand'), 150);
      timeoutsRef.current.push(timeout);
    } else if (phase === 'expand') {
      // 拡大フェーズからpulseへ
      timeout = setTimeout(() => setPhase('pulse'), 400);
      timeoutsRef.current.push(timeout);
    } else if (phase === 'pulse') {
      // パルスフェーズからfadeOutへ
      timeout = setTimeout(() => setPhase('fadeOut'), 300);
      timeoutsRef.current.push(timeout);
    } else if (phase === 'fadeOut') {
      // フェードアウトフェーズから完了
      timeout = setTimeout(() => {
        removeTargetUnit(unitId); // コンテキストをリセット
        if (onComplete) onComplete();
      }, 200);
      timeoutsRef.current.push(timeout);
    }

    return clearTimeouts;
  }, [phase, onComplete]);

  // フェーズごとのスタイル
  const style = useMemo(() => {
    switch (phase) {
      case 'appear':
        return { transform: 'scale(0.2)', opacity: 0.7 };
      case 'expand':
        return { transform: 'scale(0.8)', opacity: 0.5 };
      case 'pulse':
        return { transform: 'scale(0.9)', opacity: 0.3 };
      case 'fadeOut':
        return { transform: 'scale(1.1)', opacity: 0 };
      default:
        return { transform: 'scale(0)', opacity: 0 };
    }
  }, [phase]);

  return (
    <div className="absolute inset-0 pointer-events-none" data-unit-id={unitId}>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
          ...style,
          transition: 'all 0.3s ease-out',
        }}
      />
    </div>
  );
};
