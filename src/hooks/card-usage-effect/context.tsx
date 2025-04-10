'use client';

import { createContext, ReactNode, useReducer, useMemo } from "react";

// Define the supported drive types
export type DriveType = "UNIT" | "EVOLVE" | "INTERCEPT" | "TRIGGER" | "JOKER";
export type Position = "left" | "center" | "right";
export type Phase = "phase1" | "phase2" | "phase3" | "hidden";

// Define the parameters for showing the effect
export interface CardUsageEffectParams {
  image: string;
  type: DriveType;
  position: Position;
}

// Define the state interface for the card usage effect
export interface CardUsageEffectState {
  isVisible: boolean;
  imageUrl: string;
  type: DriveType;
  position: Position;
  phase: Phase;
}

// Define the action types for the reducer
export type CardUsageEffectAction =
  | { type: 'SHOW_EFFECT'; params: CardUsageEffectParams }
  | { type: 'SET_PHASE'; phase: Phase }
  | { type: 'HIDE_EFFECT' };

// Define the context type
export type CardUsageEffectContextType = {
  state: CardUsageEffectState;
  showCardUsageEffect: (params: CardUsageEffectParams) => Promise<void>;
  hideCardUsageEffect: () => void;
};

// Create the context
export const CardUsageEffectContext = createContext<CardUsageEffectContextType | undefined>(undefined);

// Initial state
const initialState: CardUsageEffectState = {
  isVisible: false,
  imageUrl: '',
  type: 'UNIT',
  position: 'center',
  phase: 'hidden',
};

// Reducer function
function cardUsageEffectReducer(state: CardUsageEffectState, action: CardUsageEffectAction): CardUsageEffectState {
  switch (action.type) {
    case 'SHOW_EFFECT':
      return {
        ...state,
        isVisible: true,
        imageUrl: action.params.image,
        type: action.params.type,
        position: action.params.position,
        phase: 'phase1'
      };
    case 'SET_PHASE':
      return {
        ...state,
        phase: action.phase,
      };
    case 'HIDE_EFFECT':
      return {
        ...state,
        isVisible: false,
        phase: 'hidden',
      };
    default:
      return state;
  }
}

// Provider component
export const CardUsageEffectProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cardUsageEffectReducer, initialState);

  // Timing configuration for phases (in ms)
  const timings = {
    phase1: 50,    // Almost immediate transition (just enough to render)
    phase2: 600,   // Half the previous duration (1200ms -> 600ms)
    phase3: 500,   // Keep the same exit timing
  };

  // Action creators
  const showCardUsageEffect = (params: CardUsageEffectParams): Promise<void> => {
    // Cancel any ongoing animation
    hideCardUsageEffect();
    
    // Start new animation
    dispatch({ type: 'SHOW_EFFECT', params });

    return new Promise((resolve) => {
      // Phase 1 -> Phase 2
      setTimeout(() => {
        dispatch({ type: 'SET_PHASE', phase: 'phase2' });
        
        // Add a 500ms pause after reaching phase2 (scale 2)
        setTimeout(() => {
          // Phase 2 -> Phase 3
          dispatch({ type: 'SET_PHASE', phase: 'phase3' });
          
          // Phase 3 -> Hidden
          setTimeout(() => {
            dispatch({ type: 'HIDE_EFFECT' });
            resolve();
          }, timings.phase3);
        }, timings.phase2 + 500); // Add 500ms pause to the phase2 duration
      }, timings.phase1);
    });
  };

  const hideCardUsageEffect = () => {
    dispatch({ type: 'HIDE_EFFECT' });
  };

  // Memoized context value
  const contextValue = useMemo(
    () => ({ state, showCardUsageEffect, hideCardUsageEffect }),
    [state]
  );

  return (
    <CardUsageEffectContext.Provider value={contextValue}>
      {children}
    </CardUsageEffectContext.Provider>
  );
};
