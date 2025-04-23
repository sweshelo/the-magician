'use client';

import React, { createContext, useState, ReactNode, useCallback } from 'react';

// Animation phases for the attack sequence
export type AttackAnimationPhase = 'idle' | 'declaration' | 'preparation' | 'launch' | 'return';

// Position interface for tracking coordinates
export interface Position {
  x: number;
  y: number;
}

// State interface for the animation context
export interface AttackAnimationState {
  phase: AttackAnimationPhase;
  attackingUnitId: string | null;
  targetPosition: Position | null;
  initialPosition: Position | null;
  isPlayerUnit: boolean; // True if it's the player's unit attacking
}

// Context interface including state and control functions
export interface AttackAnimationContextType {
  state: AttackAnimationState;
  startAttackDeclaration: (unitId: string, isPlayerUnit: boolean, position: Position) => void;
  proceedToPreparation: (targetPosition: Position) => void;
  resetAnimation: () => void;
}

// Initial state for the animation context
const initialState: AttackAnimationState = {
  phase: 'idle',
  attackingUnitId: null,
  targetPosition: null,
  initialPosition: null,
  isPlayerUnit: true,
};

// Create the context with a default value
export const AttackAnimationContext = createContext<AttackAnimationContextType>({
  state: initialState,
  startAttackDeclaration: () => {},
  proceedToPreparation: () => {},
  resetAnimation: () => {},
});

// Provider component for the attack animation context
export const AttackAnimationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AttackAnimationState>(initialState);

  // Start the attack declaration phase (unit expands and moves forward)
  const startAttackDeclaration = useCallback(
    (unitId: string, isPlayerUnit: boolean, position: Position) => {
      setState({
        phase: 'declaration',
        attackingUnitId: unitId,
        targetPosition: null,
        initialPosition: position,
        isPlayerUnit,
      });
    },
    []
  );

  // Proceed to the preparation phase with target position (unit returns to original position, then launches)
  const proceedToPreparation = useCallback((targetPosition: Position) => {
    setState(prevState => {
      if (prevState.phase !== 'declaration') return prevState;
      return {
        ...prevState,
        phase: 'preparation',
        targetPosition,
      };
    });
  }, []);

  // Reset the animation state to idle
  const resetAnimation = useCallback(() => {
    setState(initialState);
  }, []);

  // Handle automatic phase progression
  React.useEffect(() => {
    // When in launch phase, automatically transition to return phase after a delay
    if (state.phase === 'launch') {
      const timeout = setTimeout(() => {
        setState(prevState => ({
          ...prevState,
          phase: 'return',
        }));
      }, 300); // 300ms delay for launch phase

      return () => clearTimeout(timeout);
    }

    // When in return phase, automatically reset to idle after animation completes
    if (state.phase === 'return') {
      const timeout = setTimeout(() => {
        resetAnimation();
      }, 500); // 500ms delay for return phase

      return () => clearTimeout(timeout);
    }

    // Automatically transition from preparation to launch if target position is set
    if (state.phase === 'preparation' && state.targetPosition) {
      const timeout = setTimeout(() => {
        setState(prevState => ({
          ...prevState,
          phase: 'launch',
        }));
      }, 300); // 300ms delay for preparation phase

      return () => clearTimeout(timeout);
    }
  }, [state.phase, state.targetPosition, resetAnimation]);

  return (
    <AttackAnimationContext.Provider
      value={{
        state,
        startAttackDeclaration,
        proceedToPreparation,
        resetAnimation,
      }}
    >
      {children}
    </AttackAnimationContext.Provider>
  );
};
