'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StatusChange, useStatusChange } from '@/hooks/status-change';

export type StatusChangeType = 'damage' | 'level' | 'bp' | 'buff' | 'debuff';

interface StatusChangeEffectProps {
  unitId: string;
  type: StatusChangeType;
  value: number | string;
  position?: { x: number; y: number }; // 位置をカスタマイズするための座標
  onComplete?: () => void;
}

// 各ステータスタイプに対する色とラベルを定義
const STATUS_CONFIG = {
  damage: { color: '#ff4d4d', label: 'ダメージ' },
  level: { color: '#4dff4d', label: 'レベルアップ' },
  bp: { color: '#4d4dff', label: 'BP' },
  buff: { color: '#ffdd4d', label: 'バフ' },
  debuff: { color: '#a64dff', label: 'デバフ' },
};

export const StatusChangeEffect: React.FC<StatusChangeEffectProps> = ({
  unitId,
  type,
  value,
  position,
  onComplete,
}) => {
  // フェーズ状態の管理
  const [phase, setPhase] = useState<'initial' | 'appear' | 'hold' | 'fadeOut'>('initial');
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // 省略されていない場合はランダムな位置を生成
  const effectPosition = useMemo(() => {
    if (position) return position;

    // ±15pxの範囲でランダムな位置を生成
    return {
      x: Math.floor(Math.random() * 30) - 15,
      y: Math.floor(Math.random() * 30) - 15,
    };
  }, [position]);

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
      // 表示フェーズからholdへ
      timeout = setTimeout(() => setPhase('hold'), 200);
      timeoutsRef.current.push(timeout);
    } else if (phase === 'hold') {
      // 保持フェーズからfadeOutへ
      timeout = setTimeout(() => setPhase('fadeOut'), 1000);
      timeoutsRef.current.push(timeout);
    } else if (phase === 'fadeOut') {
      // フェードアウトフェーズから完了
      timeout = setTimeout(() => {
        if (onComplete) onComplete();
      }, 300);
      timeoutsRef.current.push(timeout);
    }

    return clearTimeouts;
  }, [phase, onComplete]);

  // フェーズごとのスタイル
  const style = useMemo(() => {
    switch (phase) {
      case 'appear':
        return {
          opacity: 0,
          transform: `translate(${effectPosition.x}px, ${effectPosition.y - 10}px) scale(0.8)`,
        };
      case 'hold':
        return {
          opacity: 1,
          transform: `translate(${effectPosition.x}px, ${effectPosition.y}px) scale(1)`,
        };
      case 'fadeOut':
        return {
          opacity: 0,
          transform: `translate(${effectPosition.x}px, ${effectPosition.y - 20}px) scale(0.9)`,
        };
      default:
        return {
          opacity: 0,
          transform: `translate(${effectPosition.x}px, ${effectPosition.y}px) scale(0.5)`,
        };
    }
  }, [phase, effectPosition]);

  // ステータスタイプに基づく色とラベル
  const { color, label } = STATUS_CONFIG[type];

  // 値の表示形式（正負の符号を追加）
  const displayValue = useMemo(() => {
    if (typeof value === 'number') {
      return value > 0 ? `+${value}` : value.toString();
    }
    return value;
  }, [value]);

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      data-unit-id={unitId}
      style={{
        zIndex: 50, // 最前面に表示
      }}
    >
      <div
        className="flex flex-col items-center px-2 py-1 rounded"
        style={{
          backgroundColor: `${color}33`, // 20% 透明度
          border: `1px solid ${color}`,
          boxShadow: `0 0 8px ${color}66`,
          color: color,
          fontWeight: 'bold',
          fontSize: '0.9rem',
          ...style,
          transition: 'all 0.3s ease-out',
        }}
      >
        <div className="text-xs">{label}</div>
        <div className="text-sm">{displayValue}</div>
      </div>
    </div>
  );
};

// 複数のステータス変更を同時に表示するコンポーネント
interface MultipleStatusChangeProps {
  unitId: string;
  changes: StatusChange[];
  statusChangeId?: string; // コンテキストから渡されるID
  onComplete?: () => void;
}

export const MultipleStatusChange: React.FC<MultipleStatusChangeProps> = ({
  unitId,
  changes,
  statusChangeId,
  onComplete,
}) => {
  const [completedCount, setCompletedCount] = useState(0);
  const { removeStatusChange } = useStatusChange();

  // すべてのエフェクトが完了したら onComplete を呼び出す
  useEffect(() => {
    if (completedCount === changes.length) {
      // コンテキストのステータス変更を削除
      if (statusChangeId) {
        removeStatusChange(statusChangeId);
      }

      if (onComplete) {
        onComplete();
      }
    }
  }, [completedCount, changes.length, onComplete, removeStatusChange, statusChangeId]);

  return (
    <>
      {changes.map((change, index) => (
        <StatusChangeEffect
          key={`${unitId}-${change.type}-${index}`}
          unitId={unitId}
          type={change.type}
          value={change.value}
          onComplete={() => setCompletedCount(prev => prev + 1)}
          // ランダムな位置を計算し、複数のエフェクトが重ならないようにする
          position={{
            x: ((index % 3) - 1) * 30 + Math.floor(Math.random() * 20) - 10,
            y: Math.floor(index / 3) * 35 + Math.floor(Math.random() * 10) - 5,
          }}
        />
      ))}
    </>
  );
};
