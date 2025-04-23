'use client';

import { useContext } from 'react';
import { AttackAnimationContext } from './context';

// Hook to access the attack animation context
export const useAttackAnimation = () => {
  const context = useContext(AttackAnimationContext);
  if (context === undefined) {
    throw new Error('useAttackAnimation must be used within an AttackAnimationProvider');
  }
  return context;
};

// Utility function to determine if a specific unit is currently attacking
export const useIsUnitAttacking = (unitId: string) => {
  const { state } = useAttackAnimation();
  return state.attackingUnitId === unitId && state.phase !== 'idle';
};

// Utility function to get the current animation style for a unit
export const useUnitAttackAnimationStyle = (unitId: string) => {
  const { state } = useAttackAnimation();

  if (state.attackingUnitId !== unitId) {
    return {}; // Return empty style object if not the attacking unit
  }

  switch (state.phase) {
    case 'declaration':
      // Expand by 1.25x
      return {
        transform: `scale(1.25)`,
        transformOrigin: 'center center',
        transition: 'transform 0.3s ease-out',
      };

    case 'preparation':
      // Return to original position but keep expanded size (1.25x)
      return {
        transform: 'scale(1.25)',
        transformOrigin: 'center center',
        transition: 'transform 0.3s ease-out',
      };

    case 'launch':
      // Move to absolute target position by calculating distance from initial position
      if (state.targetPosition && state.initialPosition) {
        // Calculate the distance between target and initial position
        const deltaX = state.targetPosition.x - state.initialPosition.x;
        const deltaY = state.targetPosition.y - state.initialPosition.y;

        return {
          transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(1.25)`,
          transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)', // Easing for "spring" effect
        };
      }
      return {};

    case 'return':
      // Return to original position and size
      return {
        transform: 'scale(1) translate3d(0, 0, 0)',
        transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
      };

    default:
      return {};
  }
};

// Utility function to get the BP view style during animation
// The BP view should not scale with the rest of the unit
export const useBPViewAnimationStyle = (unitId: string) => {
  const { state } = useAttackAnimation();

  if (state.attackingUnitId !== unitId) {
    return {};
  }

  // Forward direction depends on whether it's the player's unit
  const forwardDirection = state.isPlayerUnit ? -1 : 1;
  const moveDistance = 12; // 12px as specified in requirements

  switch (state.phase) {
    case 'declaration':
      // Move forward but don't scale
      return {
        transform: `translateY(${forwardDirection * moveDistance}px)`,
        transition: 'transform 0.3s ease-out',
      };

    case 'preparation':
      // Return to original position
      return {
        transform: 'translateY(0)',
        transition: 'transform 0.3s ease-out',
      };

    case 'launch':
      // Move to absolute target position by calculating distance from initial position
      if (state.targetPosition && state.initialPosition) {
        // Calculate the distance between target and initial position
        const deltaX = state.targetPosition.x - state.initialPosition.x;
        const deltaY = state.targetPosition.y - state.initialPosition.y;

        return {
          transform: `translate3d(${deltaX}px, ${deltaY}px, 0)`,
          transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        };
      }
      return {};

    case 'return':
      // Return to original position
      return {
        transform: 'translate3d(0, 0, 0)',
        transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
      };

    default:
      return {};
  }
};
