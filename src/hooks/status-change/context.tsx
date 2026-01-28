'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback, useRef } from 'react';
import { StatusChangeType } from '@/component/ui/StatusChangeEffect';

export interface StatusChange {
  type: StatusChangeType;
  value: number | string;
}

export interface StatusChangeItem {
  unitId: string;
  changes: StatusChange[];
  id: string; // 一意のID（同一ユニットに複数表示できるように）
}

export interface StatusChangeContextType {
  statusChanges: StatusChangeItem[];
  addStatusChange: (item: Omit<StatusChangeItem, 'id'>) => string; // IDを生成して返す
  removeStatusChange: (id: string) => void;
  getStatusChangesForUnit: (unitId: string) => StatusChangeItem[];
  scheduleRemoval: (id: string) => void;
  cancelScheduledRemoval: (id: string) => void;
}

const StatusChangeContext = createContext<StatusChangeContextType | undefined>(undefined);

export const StatusChangeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [statusChanges, setStatusChanges] = useState<StatusChangeItem[]>([]);
  const cleanupTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // ステータス変更を追加し、生成されたIDを返す
  const addStatusChange = useCallback((item: Omit<StatusChangeItem, 'id'>): string => {
    const id = `status-${item.unitId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    setStatusChanges(prev => [...prev, { ...item, id }]);

    return id;
  }, []);

  // ステータス変更を削除
  const removeStatusChange = useCallback((id: string): void => {
    setStatusChanges(prev => prev.filter(item => item.id !== id));
  }, []);

  // 特定ユニットのステータス変更を取得
  const getStatusChangesForUnit = useCallback(
    (unitId: string): StatusChangeItem[] => {
      return statusChanges.filter(item => item.unitId === unitId);
    },
    [statusChanges]
  );

  // 遅延削除をスケジュール（React Strict Mode対応）
  const scheduleRemoval = useCallback((id: string) => {
    const existing = cleanupTimeouts.current.get(id);
    if (existing) clearTimeout(existing);

    const timeout = setTimeout(() => {
      setStatusChanges(prev => prev.filter(item => item.id !== id));
      cleanupTimeouts.current.delete(id);
    }, 100);
    cleanupTimeouts.current.set(id, timeout);
  }, []);

  // スケジュールされた削除をキャンセル
  const cancelScheduledRemoval = useCallback((id: string) => {
    const existing = cleanupTimeouts.current.get(id);
    if (existing) {
      clearTimeout(existing);
      cleanupTimeouts.current.delete(id);
    }
  }, []);

  return (
    <StatusChangeContext.Provider
      value={{
        statusChanges,
        addStatusChange,
        removeStatusChange,
        getStatusChangesForUnit,
        scheduleRemoval,
        cancelScheduledRemoval,
      }}
    >
      {children}
    </StatusChangeContext.Provider>
  );
};

export const useStatusChange = () => {
  const context = useContext(StatusChangeContext);
  if (context === undefined) {
    throw new Error('useStatusChange must be used within a StatusChangeProvider');
  }
  return context;
};
