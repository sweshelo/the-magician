'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface SelectEffectContextType {
  targetUnitId: string | undefined;
  setTargetUnitId: (unitId: string | undefined) => void;
}

const SelectEffectContext = createContext<SelectEffectContextType | undefined>(undefined);

export const SelectEffectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [targetUnitId, setTargetUnitId] = useState<string | undefined>(undefined);

  return (
    <SelectEffectContext.Provider value={{ targetUnitId, setTargetUnitId }}>
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
