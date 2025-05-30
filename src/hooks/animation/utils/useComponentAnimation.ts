'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * コンポーネント固有のアニメーションフェーズを管理するカスタムフック
 * @param initialPhase 初期フェーズ
 * @param phaseSequence フェーズの遷移順序
 * @param phaseDurations 各フェーズの持続時間（ミリ秒）
 * @param onComplete アニメーション完了時のコールバック
 */
export function useComponentAnimation<T extends string>(
  initialPhase: T,
  phaseSequence: T[],
  phaseDurations: Record<T, number>,
  onComplete?: () => void
) {
  const [phase, setPhase] = useState<T>(initialPhase);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // 全てのタイムアウトをクリアする関数
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  // フェーズ遷移ロジック
  useEffect(() => {
    // 現在のフェーズのインデックスを取得
    const currentIndex = phaseSequence.indexOf(phase);
    if (currentIndex === -1) return;

    // 次のフェーズがあれば、現在のフェーズの持続時間後に遷移
    if (currentIndex < phaseSequence.length - 1) {
      const nextPhase = phaseSequence[currentIndex + 1];
      const duration = phaseDurations[phase];

      const timeout = setTimeout(() => {
        setPhase(nextPhase);
      }, duration);

      timeoutsRef.current.push(timeout);
    } else if (currentIndex === phaseSequence.length - 1 && onComplete) {
      // 最終フェーズが完了したらコールバックを実行
      const timeout = setTimeout(() => {
        onComplete();
      }, phaseDurations[phase]);

      timeoutsRef.current.push(timeout);
    }

    return clearAllTimeouts;
  }, [phase, phaseSequence, phaseDurations, onComplete]);

  // 強制的に特定のフェーズに遷移するヘルパー
  const jumpToPhase = (targetPhase: T) => {
    if (phaseSequence.includes(targetPhase)) {
      clearAllTimeouts();
      setPhase(targetPhase);
    }
  };

  // アニメーションをリセットするヘルパー
  const resetAnimation = () => {
    clearAllTimeouts();
    setPhase(initialPhase);
  };

  return {
    phase,
    setPhase,
    jumpToPhase,
    resetAnimation,
  };
}
