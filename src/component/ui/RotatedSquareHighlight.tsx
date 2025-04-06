import React, { useEffect, useState } from 'react';

interface RotatedSquareHighlightProps {
  isVisible: boolean;
  children: React.ReactNode;
}

export const RotatedSquareHighlight: React.FC<RotatedSquareHighlightProps> = ({ isVisible, children }) => {
  const [showHighlight, setShowHighlight] = useState(isVisible);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // Handle visibility changes with animation timing
  useEffect(() => {
    if (isVisible && !showHighlight) {
      setShowHighlight(true);
      setIsAnimatingOut(false);
    } else if (!isVisible && showHighlight && !isAnimatingOut) {
      setIsAnimatingOut(true);
      // Keep showing the element during fade-out animation
      const timer = setTimeout(() => {
        setShowHighlight(false);
      }, 500); // Match the animation duration (0.5s)

      return () => clearTimeout(timer);
    }
  }, [isVisible, showHighlight, isAnimatingOut]);

  return (
    <div className="relative">
      {children}
      {showHighlight && (
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
          <div
            className="w-17 h-17 border border-white shadow-[0_0_5px_rgba(255,255,255,0.7)]"
            style={{
              animation: isAnimatingOut
                ? 'highlightDisappear 0.5s ease-out forwards, squareRotate 10s linear infinite'
                : 'highlightAppear 0.5s ease-out, squareRotate 10s linear infinite'
            }}
          >
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-4 h-0.5 bg-white -translate-y-1 -translate-x-1"></div>
            <div className="absolute top-0 left-0 w-0.5 h-4 bg-white -translate-y-1 -translate-x-1"></div>

            <div className="absolute top-0 right-0 w-4 h-0.5 bg-white -translate-y-1 translate-x-1"></div>
            <div className="absolute top-0 right-0 w-0.5 h-4 bg-white -translate-y-1 translate-x-1"></div>

            <div className="absolute bottom-0 left-0 w-4 h-0.5 bg-white translate-y-1 -translate-x-1"></div>
            <div className="absolute bottom-0 left-0 w-0.5 h-4 bg-white translate-y-1 -translate-x-1"></div>

            <div className="absolute bottom-0 right-0 w-4 h-0.5 bg-white translate-y-1 translate-x-1"></div>
            <div className="absolute bottom-0 right-0 w-0.5 h-4 bg-white translate-y-1 translate-x-1"></div>
          </div>
        </div>
      )}
    </div>
  );
};
