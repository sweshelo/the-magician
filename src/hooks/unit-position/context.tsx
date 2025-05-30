'use client';

import React, { createContext, useContext, useRef, RefObject } from 'react';

interface UnitRefs {
  [unitId: string]: RefObject<HTMLDivElement>;
}

interface UnitPositionContextType {
  registerUnitRef: (unitId: string, ref: RefObject<HTMLDivElement>) => void;
  getUnitCenterPosition: (unitId: string) => { x: number; y: number } | undefined;
}

const UnitPositionContext = createContext<UnitPositionContextType | undefined>(undefined);

export const UnitPositionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const unitRefsRef = useRef<UnitRefs>({});

  const registerUnitRef = (unitId: string, ref: RefObject<HTMLDivElement>) => {
    unitRefsRef.current[unitId] = ref;
  };

  const getUnitCenterPosition = (unitId: string) => {
    const ref = unitRefsRef.current[unitId];
    if (!ref || !ref.current) return undefined;

    const rect = ref.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  return (
    <UnitPositionContext.Provider value={{ registerUnitRef, getUnitCenterPosition }}>
      {children}
    </UnitPositionContext.Provider>
  );
};

export const useUnitPosition = () => {
  const context = useContext(UnitPositionContext);
  if (!context) {
    throw new Error('useUnitPosition must be used within a UnitPositionProvider');
  }
  return context;
};
