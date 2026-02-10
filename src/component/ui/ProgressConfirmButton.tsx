import { useRef, useMemo } from 'react';
import './ProgressConfirmButton.css';

type ProgressConfirmButtonProps = {
  timeLimit?: number; // Time limit in seconds (optional)
  buttonText: string; // Text to display on the button
  onConfirm: () => void; // Action to perform on confirmation
  onTimeExpire?: () => void; // Action to perform when time expires (optional)
  disabled?: boolean; // Whether the button is disabled
  className?: string; // Additional styling
  isRunning?: boolean; // Whether the timer is running
};

export const ProgressConfirmButton = ({
  timeLimit,
  buttonText,
  onConfirm,
  onTimeExpire,
  disabled = false,
  className = '',
  isRunning = true,
}: ProgressConfirmButtonProps) => {
  // Use a combination of timeLimit and isRunning as the key to force re-render
  const animationKey = useMemo(() => `${timeLimit}-${isRunning ? '1' : '0'}`, [timeLimit, isRunning]);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={`w-72 ${className}`}>
      {timeLimit ? (
        <div className="w-full h-10 bg-gray-700 rounded-lg overflow-hidden relative">
          <div
            ref={progressBarRef}
            key={animationKey}
            className={`h-full bg-red-700 countdown-animation ${isRunning ? 'countdown-animation-running' : 'countdown-animation-paused'}`}
            style={{
              width: '100%',
              animationDuration: `${timeLimit}s`,
            }}
            onAnimationEnd={onTimeExpire}
          />
          <button
            className="absolute inset-0 flex items-center justify-center text-white font-bold border-2 border-red-900 rounded-lg shadow-lg hover:border-red-200 transition-colors disabled:opacity-50"
            onClick={onConfirm}
            disabled={disabled}
          >
            {buttonText}
          </button>
        </div>
      ) : (
        <button
          className="w-full p-2 rounded-lg bg-red-700 text-white border-2 border-red-900 shadow-lg cursor-pointer hover:bg-red-600 hover:border-red-200 transition-colors disabled:opacity-50"
          onClick={onConfirm}
          disabled={disabled}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};
