'use client';

import { IUnit } from '@/submodule/suit/types';
import { createContext, Dispatch, SetStateAction, useCallback, useState } from 'react';

export type SelectionMode = 'select' | 'target' | 'block';

export interface UnitSelectionContextType {
  candidate: IUnit[] | undefined;
  setCandidate: (unit: IUnit[] | undefined) => void;
  selectionMode: SelectionMode;
  setSelectionMode: (mode: SelectionMode) => void;
  handleSelected: ((unit?: IUnit['id']) => void) | undefined;
  setHandleSelected: (callback: (unit?: IUnit['id']) => void) => void;
  setAvailableUnits: (
    units: IUnit[],
    onSelected: (unitId?: IUnit['id']) => void,
    mode: SelectionMode
  ) => void;
  activeUnit: IUnit | undefined;
  setActiveUnit: Dispatch<SetStateAction<IUnit | undefined>>;

  // 効果発動アニメーション
  animationUnit: IUnit['id'] | undefined;
  setAnimationUnit: Dispatch<SetStateAction<IUnit['id'] | undefined>>;
}

export const UnitSelectionContext = createContext<UnitSelectionContextType | undefined>(undefined);

export interface UnitSelectionProviderProps {
  children: React.ReactNode;
}

export const UnitSelectionProvider = ({ children }: UnitSelectionProviderProps) => {
  // State
  const [candidate, setCandidate] = useState<IUnit[]>();
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('target');
  const [handleSelected, setHandleSelected] = useState<((unit?: IUnit['id']) => void) | undefined>(
    undefined
  );
  const [activeUnit, setActiveUnit] = useState<IUnit | undefined>(undefined);
  const [animationUnit, setAnimationUnit] = useState<IUnit['id']>();

  const setAvailableUnits = useCallback(
    (units: IUnit[], onSelected: (unit?: IUnit['id']) => void, mode: SelectionMode = 'target') => {
      setCandidate(units);
      setSelectionMode(mode);
      setHandleSelected(() => onSelected);
    },
    []
  );

  return (
    <UnitSelectionContext.Provider
      value={{
        candidate,
        selectionMode,
        setSelectionMode,
        setCandidate,
        handleSelected,
        setHandleSelected,
        setAvailableUnits,
        activeUnit,
        setActiveUnit,
        animationUnit,
        setAnimationUnit,
      }}
    >
      {children}
    </UnitSelectionContext.Provider>
  );
};
