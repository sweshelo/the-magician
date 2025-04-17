'use client';

import { useState, useRef } from 'react';
import { TimerContext, TimerContextType, TimerProviderProps } from './hooks';

export const TimerProvider = ({ children, initialTime = 60 }: TimerProviderProps) => {
  // タイマー開始時刻
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  // 初期残り秒数
  const [initialTimeValue, setInitialTimeValue] = useState(initialTime);
  // 動作中か
  const [isRunning, setIsRunning] = useState(true);

  // 一時停止時の残り秒数
  const pauseRemainRef = useRef<number | null>(null);

  const pauseTimer = () => {
    if (!isRunning) return;
    setIsRunning(false);
    if (startDate) {
      const elapsed = (Date.now() - startDate.getTime()) / 1000;
      pauseRemainRef.current = Math.max(0, initialTimeValue - elapsed);
    }
  };

  const resumeTimer = () => {
    if (isRunning) return;
    setIsRunning(true);
    // 再開時は現在時刻を新たなstartDateにし、pauseRemainRef.currentを新たなinitialTimeValueに
    if (pauseRemainRef.current !== null) {
      setStartDate(new Date());
      setInitialTimeValue(pauseRemainRef.current);
      pauseRemainRef.current = null;
    }
  };

  const resetTimer = () => {
    setStartDate(new Date());
    setInitialTimeValue(initialTime);
    setIsRunning(true);
    pauseRemainRef.current = null;
  };

  const endTurn = () => {
    setIsRunning(false);
    setStartDate(null);
    setInitialTimeValue(0);
    pauseRemainRef.current = null;
  };

  const value: TimerContextType = {
    startDate,
    initialTime: initialTimeValue,
    isRunning,
    pauseTimer,
    resumeTimer,
    resetTimer,
    endTurn,
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};
