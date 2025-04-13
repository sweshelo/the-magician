import { useState, useEffect, useRef } from 'react';

interface BPViewProps {
  bp: number;
  lv: number;
  diff: number;
}

export const BPView = ({ bp, lv, diff }: BPViewProps) => {
  const [displayedBp, setDisplayedBp] = useState(bp);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const startValueRef = useRef<number>(0);
  const targetValueRef = useRef<number>(bp);

  // Animation duration in ms
  const ANIMATION_DURATION = 200; // 0.2 seconds

  // Initialize displayedBp with bp on component mount
  useEffect(() => {
    setDisplayedBp(bp);
    targetValueRef.current = bp;
  }, []);

  // Handle BP changes and animation
  useEffect(() => {
    // If values are already equal, no animation needed
    if (displayedBp === bp) return;

    // Cancel any ongoing animation
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }

    // Save the starting values
    startTimeRef.current = performance.now();
    startValueRef.current = displayedBp;
    targetValueRef.current = bp;

    // Animation function using requestAnimationFrame for smoother animation
    const animate = (currentTime: number) => {
      // Calculate how much time has passed as a percentage of total duration
      const elapsedTime = currentTime - startTimeRef.current;
      const progress = Math.min(elapsedTime / ANIMATION_DURATION, 1);

      if (progress < 1) {
        // Calculate the current value based on progress
        const currentValue = Math.round(
          startValueRef.current + (targetValueRef.current - startValueRef.current) * progress
        );

        setDisplayedBp(currentValue);

        // Continue animation
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete, set to final value
        setDisplayedBp(targetValueRef.current);
        animationRef.current = null;
      }
    };

    // Start the animation
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup on unmount or when bp changes again
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [bp]);
  const blue = diff > 0 ? 'text-cyan-300' : undefined;
  const red = diff < 0 ? 'text-red-400' : undefined;
  const fontColor = blue || red || 'text-white';

  return (
    <div className={`flex relative w-32 h-[28px] mt-1 shadow-[2px_2px_2px_dimgray]`}>
      {/* パワー数値 */}
      <div className="flex w-32 items-center justify-center z-1 bg-gray-900">
        <span className="text-white font-bold border-r-1 border-gray-600 pr-2">{`Lv${lv}`}</span>
        <span
          className={`ml-2 bold text-lg font-bold font-mono ${fontColor} w-16 text-right`}
        >{`${displayedBp < 0 ? 0 : displayedBp}`}</span>
      </div>
    </div>
  );
};
