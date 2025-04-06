import { useContext } from "react";
import { SelectionMode, UnitSelectionContext } from "./context";

// Re-export the SelectionMode type for convenience
export type { SelectionMode };

export const useUnitSelection = () => {
  const context = useContext(UnitSelectionContext);

  if (!context) {
    throw new Error("useUnitSelection must be used within a UnitSelectionProvider");
  }

  return {
    // Current state
    selectedUnitId: context.selectedUnitId,
    actionButtonUnitId: context.actionButtonUnitId,
    selectionMode: context.selectionMode,
    
    // User actions
    selectUnit: context.selectUnit,
    showActionButtons: context.showActionButtons,
    hideActionButtons: context.hideActionButtons,
    
    // System actions
    showSelectionButton: context.showSelectionButton,
    setSelectionMode: context.setSelectionMode,
    setOnUnitSelected: context.setOnUnitSelected,
  };
};

// Utility function to check if a unit is owned by the current player
export const isOwnUnit = (unitPlayerId: string, currentPlayerId: string): boolean => {
  return unitPlayerId === currentPlayerId;
};
