import { createContext, ReactNode, useContext } from 'react';

// 型定義
export interface TimerContextType {
  startDate: Date | null;
  initialTime: number;
  isRunning: boolean;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  endTurn: () => void;
}

export interface TimerProviderProps {
  children: ReactNode;
  initialTime?: number;
}

// タイマーコントロール用のコンテキスト
export const TimerContext = createContext<TimerContextType | null>(null);

export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
