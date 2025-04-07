'use client';

import { useState, useCallback } from 'react';

export const useUnitIconEffect = () => {
  const [showEffect, setShowEffect] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerEffect = useCallback(() => {
    if (!isAnimating) {
      console.log('UnitIconEffect: Triggering animation effect');
      setIsAnimating(true);
      setShowEffect(true);
    } else {
      console.log('UnitIconEffect: Animation already in progress, ignoring trigger');
    }
  }, [isAnimating]);

  const handleAnimationComplete = useCallback(() => {
    console.log('UnitIconEffect: Animation complete, resetting state');
    // Make sure we log the current state before changing it
    console.log('Current animation states before reset:', { showEffect, isAnimating });

    // Use setTimeout to ensure this happens after the current execution context
    setTimeout(() => {
      setShowEffect(false);
      setIsAnimating(false);
      console.log('Animation states after reset:', { showEffect: false, isAnimating: false });
    }, 0);
  }, [showEffect, isAnimating]);

  return {
    showEffect,
    isAnimating,
    triggerEffect,
    handleAnimationComplete
  };
};
