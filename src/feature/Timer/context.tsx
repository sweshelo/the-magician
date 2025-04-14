'use client';

import { useEffect, useState } from 'react';
import { TimerContext, TimerContextType, TimerProviderProps } from './hooks';

export const TimerProvider = ({ children, initialTime = 60 }: TimerProviderProps) => {
  const [isRunning, setIsRunning] = useState(true);
  const [time, setTime] = useState(initialTime);
  const [initialTimeValue] = useState(initialTime);

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resumeTimer = () => {
    setIsRunning(true);
  };

  const resetTimer = () => {
    setTime(initialTimeValue);
    setIsRunning(true);
  };

  const endTurn = () => {
    setTime(0);
    setIsRunning(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && time > 0) {
      // 100msごとに更新して小数点以下の表示をサポート
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime - 0.1;
          return newTime <= 0 ? 0 : parseFloat(newTime.toFixed(1));
        });
      }, 100);
    } else if (time === 0) {
      setIsRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, time, initialTimeValue]);

  const value: TimerContextType = {
    time,
    initialTime: initialTimeValue,
    isRunning,
    pauseTimer,
    resumeTimer,
    resetTimer,
    endTurn,
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};
