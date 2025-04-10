"use client";

import { useContext } from "react";
import {
  CardEffectDialogContext,
  CardEffectDialogContextType,
} from "./context";

// Custom hook to use the card effect dialog context
export const useCardEffectDialog = (): CardEffectDialogContextType => {
  const context = useContext(CardEffectDialogContext);

  if (context === undefined) {
    throw new Error(
      "useCardEffectDialog must be used within a CardEffectDialogProvider",
    );
  }

  return context;
};
