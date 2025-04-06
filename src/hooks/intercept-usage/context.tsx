'use client';

import { ICard } from "@/submodule/suit/types";
import { createContext, ReactNode, useState, useCallback, useRef } from "react";
import { useWebSocketGame } from "../game";

// Context type definition for intercept usage functionality
export interface InterceptUsageContextType {
  // The list of intercept cards that are available for activation
  availableIntercepts: ICard[];

  // Function to set available intercepts with optional time limit
  setAvailableIntercepts: (intercepts: ICard[], timeLimit?: number) => void;

  // Function to clear the available intercepts
  clearAvailableIntercepts: () => void;

  // Function to activate a specific intercept
  activateIntercept: (interceptId: string) => void;

  // Current time limit for intercept selection (null if no time limit)
  interceptTimeLimit: number | null;

  // Function to cancel intercept selection
  cancelInterceptSelection: () => void;
}

// Create the context with undefined default
export const InterceptUsageContext = createContext<InterceptUsageContextType | undefined>(undefined);

// Provider component that wraps the application or relevant part of it
export const InterceptUsageProvider = ({ children }: { children: ReactNode }) => {
  const [availableIntercepts, setAvailableIntercepts] = useState<ICard[]>([]);
  const [interceptTimeLimit, setInterceptTimeLimit] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { send } = useWebSocketGame();

  // Function to clear available intercepts
  const clearAvailableIntercepts = useCallback(() => {
    setAvailableIntercepts([]);
    setInterceptTimeLimit(null);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Function to set available intercepts with optional time limit
  const handleSetAvailableIntercepts = useCallback((intercepts: ICard[], timeLimit?: number) => {
    setAvailableIntercepts(intercepts);

    if (timeLimit) {
      setInterceptTimeLimit(timeLimit);

      // Set timeout to auto-cancel after time limit
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        clearAvailableIntercepts();
        setInterceptTimeLimit(null);
      }, timeLimit * 1000);
    } else {
      setInterceptTimeLimit(null);
    }
  }, [clearAvailableIntercepts]);

  // Function to cancel intercept selection
  const cancelInterceptSelection = useCallback(() => {
    // Send a cancel message to the Core (using Choose with empty array)
    send({
      action: {
        handler: 'core',
        type: 'intercept'
      },
      payload: {
        type: 'Choose',
        promptId: 'intercept_activation',
        choice: [], // Empty choice array indicates "pass"
      }
    });

    // Clear the available intercepts
    clearAvailableIntercepts();
  }, [send, clearAvailableIntercepts]);

  // Function to activate a specific intercept and send message to Core
  const activateIntercept = useCallback((interceptId: string) => {
    // Send the activation message to the Core
    send({
      action: {
        handler: 'core',
        type: 'intercept'
      },
      payload: {
        type: 'Choose',
        promptId: 'intercept_activation',
        choice: [interceptId],
      }
    });

    // Clear the available intercepts after activation
    clearAvailableIntercepts();
  }, [send, clearAvailableIntercepts]);

  // The value to be provided by the context
  const contextValue: InterceptUsageContextType = {
    availableIntercepts,
    setAvailableIntercepts: handleSetAvailableIntercepts,
    clearAvailableIntercepts,
    activateIntercept,
    interceptTimeLimit,
    cancelInterceptSelection,
  };

  return (
    <InterceptUsageContext.Provider value={contextValue}>
      {children}
    </InterceptUsageContext.Provider>
  );
};
