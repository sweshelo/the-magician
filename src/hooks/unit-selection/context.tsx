import { createContext, useCallback, useEffect, useState } from "react";

export type SelectionMode = 'select' | 'target' | 'block';

export interface UnitSelectionContextType {
  // Selected unit ID
  selectedUnitId: string | null;
  // Unit ID with action buttons displayed
  actionButtonUnitId: string | null;
  // Selection mode
  selectionMode: SelectionMode;

  // Actions
  selectUnit: (unitId: string) => void;
  showActionButtons: (unitId: string) => void;
  hideActionButtons: () => void;
  setSelectionMode: (mode: SelectionMode) => void;

  // System functions
  showSelectionButton: (unitId: string, mode: SelectionMode) => void;

  // Events
  onUnitSelected?: (unitId: string) => void;
  setOnUnitSelected: (callback: ((unitId: string) => void) | undefined) => void;
}

export const UnitSelectionContext = createContext<UnitSelectionContextType>({
  selectedUnitId: null,
  actionButtonUnitId: null,
  selectionMode: 'select',

  selectUnit: () => { },
  showActionButtons: () => { },
  hideActionButtons: () => { },
  setSelectionMode: () => { },

  showSelectionButton: () => { },
  setOnUnitSelected: () => { },
});

export interface UnitSelectionProviderProps {
  children: React.ReactNode;
}

export const UnitSelectionProvider = ({ children }: UnitSelectionProviderProps) => {
  // State
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [actionButtonUnitId, setActionButtonUnitId] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('select');
  const [onUnitSelected, setOnUnitSelectedCallback] = useState<((unitId: string) => void) | undefined>(undefined);

  // Actions
  const selectUnit = useCallback((unitId: string) => {
    setSelectedUnitId(unitId);
    if (onUnitSelected) {
      onUnitSelected(unitId);
    }
    setSelectedUnitId(null); // Reset selection after callback
  }, [onUnitSelected]);

  const hideActionButtons = useCallback(() => {
    setActionButtonUnitId(null);
  }, []);

  const showActionButtons = useCallback((unitId: string) => {
    // Hide any currently shown action buttons
    hideActionButtons();
    // Show action buttons for this unit
    setActionButtonUnitId(unitId);
  }, [hideActionButtons]);

  // Handle global click to hide action buttons
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Check if click was on a unit or action button
      const target = e.target as HTMLElement;
      const isUnitOrButton = target.closest('.unit-wrapper') || target.closest('.action-button') || target.closest('.selection-button');

      if (!isUnitOrButton && actionButtonUnitId) {
        hideActionButtons();
      }
    };

    document.addEventListener('mousedown', handleGlobalClick);
    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
    };
  }, [actionButtonUnitId, hideActionButtons]);

  const showSelectionButton = useCallback((unitId: string, mode: SelectionMode) => {
    setSelectedUnitId(unitId);
    setSelectionMode(mode);
  }, []);

  const setOnUnitSelected = useCallback((callback: ((unitId: string) => void) | undefined) => {
    setOnUnitSelectedCallback(callback);
  }, []);

  return (
    <UnitSelectionContext.Provider
      value={{
        selectedUnitId,
        actionButtonUnitId,
        selectionMode,

        selectUnit,
        showActionButtons,
        hideActionButtons,
        setSelectionMode,

        showSelectionButton,
        onUnitSelected,
        setOnUnitSelected,
      }}
    >
      {children}
    </UnitSelectionContext.Provider>
  );
};
