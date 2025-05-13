'use client';

import { useContext } from 'react';
import { AnimationContext } from './context';
import { EffectType } from './types';

/**
 * アニメーション登録・管理用のフック
 */
export const useAnimationRegistry = () => {
  const context = useContext(AnimationContext);

  if (!context) {
    throw new Error('useAnimationRegistry must be used within an AnimationProvider');
  }

  return context;
};

/**
 * 特定タイプのエフェクト作成を簡単にするファクトリフック
 */
export const useCreateEffect = () => {
  const { registerAnimation, unregisterAnimation } = useAnimationRegistry();

  return {
    // 選択エフェクト作成
    createSelectEffect: (unitId: string, metadata?: Record<string, unknown>) => {
      return registerAnimation(EffectType.SELECT, unitId, metadata);
    },

    // オーバークロックエフェクト作成
    createOverclockEffect: (unitId: string, metadata?: Record<string, unknown>) => {
      return registerAnimation(EffectType.OVERCLOCK, unitId, metadata);
    },

    // ステータス変更エフェクト作成
    createStatusChangeEffect: (unitId: string, metadata?: Record<string, unknown>) => {
      return registerAnimation(EffectType.STATUS_CHANGE, unitId, metadata);
    },

    // エフェクト削除
    removeEffect: (effectId: string) => {
      unregisterAnimation(effectId);
    },
  };
};
