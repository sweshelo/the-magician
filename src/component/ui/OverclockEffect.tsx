'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useOverclockEffect } from '@/hooks/overclock-effect';

interface OverclockEffectProps {
  unitId: string;
  onComplete?: () => void;
}

export const OverclockEffect: React.FC<OverclockEffectProps> = ({ unitId, onComplete }) => {
  // オーバークロックエフェクトコンテキストを使用
  const { removeOverclockUnit } = useOverclockEffect();
  // フェーズ状態の管理
  const [phase, setPhase] = useState<'initial' | 'appear' | 'expand' | 'glow' | 'fadeOut'>(
    'initial'
  );
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // 月桂冠の葉の生成 - より高度な配置（ランダム要素排除・上部開口部の修正）
  const laurelLeaves = useMemo(() => {
    // 左右に16枚ずつ、計32枚の葉を配置
    return Array.from({ length: 32 }).map((_, i) => {
      // 葉の基本特性
      const isLeftSide = i < 16; // 左側か右側か
      const localIndex = isLeftSide ? i : i - 16; // 左右それぞれのインデックス

      // 互い違いな配置のために、偶数と奇数で分ける
      const isInner = localIndex % 2 === 0;

      // 角度計算 - 円周上に均等に配置
      // 葉を270°から90°（左側）と90°から270°（右側）の範囲に均等配置
      // これにより冠の開口部が確実に最上部(0°)になる

      // 角度ステップの計算
      const totalLeaves = 16; // 左右それぞれの葉の数
      const angleStep = 180 / totalLeaves; // 180°の範囲を16分割

      // 均等に配置された角度の計算
      let angle;
      if (isLeftSide) {
        // 左側の葉：270°→90°の範囲（上部を0°とする時計回り）
        angle = 270 + localIndex * angleStep;
        if (angle >= 360) angle -= 360; // 360°以上の角度を正規化
      } else {
        // 右側の葉：90°→270°の範囲
        angle = 90 + localIndex * angleStep;
      }

      // すべての葉に統一された距離を使用 - 円周上に均等配置
      const baseDistance = 85; // 全ての葉で共通の距離

      // 葉の傾き - 円周に対して放射状に配置
      // 各葉を円の中心から放射状に伸びる方向に向ける
      const rotation = angle + (isLeftSide ? -90 : 90);

      // 遅延は位置に応じて均等に設定
      const delay = localIndex * 15;

      return {
        angle,
        // 内側/外側の表現を微細な距離調整で実現
        distance: isInner ? baseDistance - 3 : baseDistance + 3,
        rotation,
        isLeftSide,
        isInner,
        delay,
        size: isInner ? 0.95 : 1.05, // 内側/外側の差を控えめに
      };
    });
  }, []);

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
      timeout = setTimeout(() => setPhase('expand'), 250);
      timeoutsRef.current.push(timeout);
    } else if (phase === 'expand') {
      // 拡大フェーズからglowへ
      timeout = setTimeout(() => setPhase('glow'), 600);
      timeoutsRef.current.push(timeout);
    } else if (phase === 'glow') {
      // 発光フェーズからfadeOutへ
      timeout = setTimeout(() => setPhase('fadeOut'), 800);
      timeoutsRef.current.push(timeout);
    } else if (phase === 'fadeOut') {
      // フェードアウトフェーズから完了
      timeout = setTimeout(() => {
        removeOverclockUnit(unitId); // コンテキストからユニットを削除
        if (onComplete) onComplete();
      }, 400);
      timeoutsRef.current.push(timeout);
    }

    return clearTimeouts;
  }, [phase, onComplete, removeOverclockUnit, unitId]);

  // フェーズごとのメインサークルスタイル
  const circleStyle = useMemo(() => {
    switch (phase) {
      case 'appear':
        return { transform: 'scale(0.4)', opacity: 0.7 };
      case 'expand':
        return { transform: 'scale(0.85)', opacity: 0.6 };
      case 'glow':
        return {
          transform: 'scale(0.9)',
          opacity: 0.7,
          boxShadow: '0 0 25px rgba(255, 215, 0, 0.7), inset 0 0 15px rgba(255, 215, 0, 0.5)',
        };
      case 'fadeOut':
        return { transform: 'scale(1.2)', opacity: 0 };
      default:
        return { transform: 'scale(0)', opacity: 0 };
    }
  }, [phase]);

  // フェーズごとの葉のスタイル
  const getLeavesStyle = (delay = 0) => {
    switch (phase) {
      case 'appear':
        return {
          opacity: 0.4,
          transform: 'scale(0.4) translateY(10px)',
          transition: `all 0.3s ease ${delay}ms`,
        };
      case 'expand':
        return {
          opacity: 0.9,
          transform: 'scale(0.9) translateY(0)',
          transition: `all 0.4s ease ${delay}ms`,
        };
      case 'glow':
        return {
          opacity: 1,
          transform: 'scale(1) translateY(0)',
          filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.7))',
          transition: `all 0.4s ease ${delay}ms`,
        };
      case 'fadeOut':
        return {
          opacity: 0,
          transform: 'scale(1.1) translateY(-10px)',
          transition: `all 0.5s ease ${delay}ms`,
        };
      default:
        return {
          opacity: 0,
          transform: 'scale(0) translateY(20px)',
          transition: 'all 0.3s ease',
        };
    }
  };

  // CSS for laurel leaf shape - more realistic
  const leafBaseStyle = `
    position: absolute;
    width: 20px;
    height: 36px;
    transform-origin: center bottom;
    background: linear-gradient(135deg, rgba(218, 165, 32, 0.9) 0%, rgba(255, 215, 0, 0.7) 60%, rgba(255, 223, 0, 0.8) 100%);
    border-radius: 60% 40% 60% 40% / 70% 40% 60% 30%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  `;

  const leafVeinStyle = `
    &:after {
      content: '';
      position: absolute;
      width: 1px;
      height: 70%;
      background: rgba(255, 255, 255, 0.5);
      top: 15%;
    }
  `;

  // CSS animation for glint effect
  const glintAnimation = `
    @keyframes glint {
      0% { opacity: 0; transform: translateY(10px) rotate(-45deg) scale(0); }
      10% { opacity: 0.9; transform: translateY(0) rotate(-45deg) scale(1); }
      60% { opacity: 0; transform: translateY(-10px) rotate(-45deg) scale(0); }
      100% { opacity: 0; transform: translateY(-10px) rotate(-45deg) scale(0); }
    }
  `;

  // Add CSS to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        .laurel-leaf {
          ${leafBaseStyle}
          ${leafVeinStyle}
        }
        
        .leaf-glint {
          position: absolute;
          width: 8px;
          height: 1px;
          background: white;
          opacity: 0;
          transform-origin: center center;
        }
        
        ${glintAnimation}
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none" data-unit-id={unitId}>
      {/* メインサークル - 月桂冠の背景円 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 190,
          height: 190,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          ...circleStyle,
          transition: 'all 0.5s ease-out',
        }}
      />

      {/* 月桂樹の葉 - オリーブの冠 */}
      {laurelLeaves.map((leaf, index) => {
        const radians = (leaf.angle * Math.PI) / 180;
        const x = Math.cos(radians) * leaf.distance;
        const y = Math.sin(radians) * leaf.distance;

        // 各葉のフェードイン設定（時間差）
        const leafStyle = getLeavesStyle(leaf.delay);

        // グリント（光る）エフェクト用のアニメーション定義 - ランダム要素排除
        const glintAnimationStyle =
          phase === 'glow'
            ? {
                animation: `glint 2s ease-in-out ${800 + leaf.delay}ms`,
                animationIterationCount: '1',
              }
            : {};

        return (
          <div
            key={index}
            className="absolute top-1/2 left-1/2"
            style={{
              transformOrigin: 'center center',
              ...leafStyle,
            }}
          >
            <div
              className="laurel-leaf"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) 
                          rotate(${leaf.rotation}deg) scale(${leaf.size})`,
                zIndex: leaf.isInner ? 5 : 10,
                filter: phase === 'glow' ? 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.5))' : 'none',
              }}
            >
              {/* キラキラ効果（グリント） */}
              {phase === 'glow' && (
                <div
                  className="leaf-glint"
                  style={{
                    ...glintAnimationStyle,
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
