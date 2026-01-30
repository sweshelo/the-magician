'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback, useRef } from 'react';

export interface SelectEffectContextType {
  targetUnitIds: string[]; // 複数ユニットが同時に選択エフェクト可能
  addTargetUnit: (unitId: string) => void;
  removeTargetUnit: (unitId: string) => void;
  scheduleRemoval: (unitId: string) => void;
  cancelScheduledRemoval: (unitId: string) => void;
}

const SelectEffectContext = createContext<SelectEffectContextType | undefined>(undefined);

export const SelectEffectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [targetUnitIds, setTargetUnitIds] = useState<string[]>([]);
  const cleanupTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const addTargetUnit = useCallback((unitId: string) => {
    setTargetUnitIds(prev => {
      if (prev.includes(unitId)) return prev;
      return [...prev, unitId];
    });
  }, []);

  const removeTargetUnit = useCallback((unitId: string) => {
    setTargetUnitIds(prev => prev.filter(id => id !== unitId));
  }, []);

  // 遅延削除をスケジュール（React Strict Mode対応）
  const scheduleRemoval = useCallback((unitId: string) => {
    const existing = cleanupTimeouts.current.get(unitId);
    if (existing) clearTimeout(existing);

    const timeout = setTimeout(() => {
      setTargetUnitIds(prev => prev.filter(id => id !== unitId));
      cleanupTimeouts.current.delete(unitId);
    }, 100);
    cleanupTimeouts.current.set(unitId, timeout);
  }, []);

  // スケジュールされた削除をキャンセル
  const cancelScheduledRemoval = useCallback((unitId: string) => {
    const existing = cleanupTimeouts.current.get(unitId);
    if (existing) {
      clearTimeout(existing);
      cleanupTimeouts.current.delete(unitId);
    }
  }, []);

  return (
    <SelectEffectContext.Provider
      value={{
        targetUnitIds,
        addTargetUnit,
        removeTargetUnit,
        scheduleRemoval,
        cancelScheduledRemoval,
      }}
    >
      {children}
    </SelectEffectContext.Provider>
  );
};

export const useSelectEffect = () => {
  const context = useContext(SelectEffectContext);
  if (context === undefined) {
    throw new Error('useSelectEffect must be used within a SelectEffectProvider');
  }
  return context;
};
