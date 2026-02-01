'use client';

import React, { createContext, ReactNode, useContext, useState, useRef, useEffect } from 'react';

interface MulliganContextType {
  showMulligan: boolean;
  setShowMulligan: (show: boolean) => void;
  timeLeft: number;
  setOnTimeout: (callback: (() => void) | null) => void;
  // Timer state - do not modify directly
  _timerStart: React.MutableRefObject<number | null>;
  _initialTime: React.MutableRefObject<number>;
  _setTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
}

const MulliganContext = createContext<MulliganContextType | undefined>(undefined);

export const MulliganProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showMulligan, setShowMulligan] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const timerStart = useRef<number | null>(null); // null when timer not running
  const initialTime = useRef<number>(10); // Initial time value in seconds
  const [timerRunning, setTimerRunning] = useState(false); // We'll use this state to trigger effect
  const onTimeoutRef = useRef<(() => void) | null>(null);
  const timeoutFiredRef = useRef(false);

  const setOnTimeout = (callback: (() => void) | null) => {
    onTimeoutRef.current = callback;
    timeoutFiredRef.current = false;
  };

  // Global timer that runs continuously in the background
  useEffect(() => {
    if (timerStart.current === null || !timerRunning) return;

    const intervalId = setInterval(() => {
      const elapsedSeconds = (Date.now() - timerStart.current!) / 1000;
      const newTimeLeft = Math.max(initialTime.current - elapsedSeconds, 0);

      setTimeLeft(parseFloat(newTimeLeft.toFixed(2)));

      if (newTimeLeft <= 0) {
        clearInterval(intervalId);
        setTimerRunning(false);
        timerStart.current = null;
        // タイムアウトコールバックを実行（二重発火防止）
        if (onTimeoutRef.current && !timeoutFiredRef.current) {
          timeoutFiredRef.current = true;
          onTimeoutRef.current();
        }
      }
    }, 10); // 10ms for smooth updates

    return () => clearInterval(intervalId);
  }, [timerRunning]);

  return (
    <MulliganContext.Provider
      value={{
        showMulligan,
        setShowMulligan,
        timeLeft,
        setOnTimeout,
        _timerStart: timerStart,
        _initialTime: initialTime,
        _setTimerRunning: setTimerRunning,
      }}
    >
      {children}
    </MulliganContext.Provider>
  );
};

export const useMulligan = (): MulliganContextType => {
  const context = useContext(MulliganContext);
  if (context === undefined) {
    throw new Error('useMulligan must be used within a MulliganProvider');
  }
  return context;
};

// Helper functions to manipulate the timer
export const useTimer = () => {
  const { _timerStart, _initialTime, _setTimerRunning } = useMulligan();

  // Start a new timer with the given duration
  const startTimer = (duration: number = 10) => {
    _initialTime.current = duration;
    _timerStart.current = Date.now();
    _setTimerRunning(true); // Trigger the effect
  };

  // Stop the timer
  const stopTimer = () => {
    _timerStart.current = null;
    _setTimerRunning(false);
  };

  // Check if timer is already running
  const isTimerRunning = () => {
    return _timerStart.current !== null;
  };

  return { startTimer, stopTimer, isTimerRunning };
};
