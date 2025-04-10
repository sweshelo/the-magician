import { useRef, useEffect } from "react";

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
  className = "",
  isRunning = true,
}: ProgressConfirmButtonProps) => {
  const animationKey = useRef(0);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Timer initialization logic
  useEffect(() => {
    if (timeLimit && isRunning) {
      animationKey.current += 1;
    }
  }, [timeLimit, isRunning]);

  return (
    <div className={`w-72 ${className}`}>
      {timeLimit ? (
        <div className="w-full h-10 bg-gray-700 rounded-lg overflow-hidden relative">
          <div
            ref={progressBarRef}
            key={animationKey.current}
            className="h-full bg-red-700"
            style={{
              width: "100%",
              animation: `countdown ${timeLimit}s linear forwards`,
              animationPlayState: isRunning ? "running" : "paused",
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
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes countdown {
            0% { width: 100%; }
            100% { width: 0%; }
          }
        `,
        }}
      />
    </div>
  );
};
