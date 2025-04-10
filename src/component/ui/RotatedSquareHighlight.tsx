interface RotatedSquareHighlightProps {
  isVisible: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const RotatedSquareHighlight: React.FC<RotatedSquareHighlightProps> = ({
  isVisible,
  children,
  onClick,
}) => {
  return (
    <div className="relative" onClick={onClick}>
      {children}
      {isVisible && (
        <div className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer">
          <div
            className="w-19 h-19 border border-white shadow-[0_0_5px_rgba(255,255,255,0.7)]"
            style={{
              animation: `highlightAppear 0.5s ease-out, squareRotateAndScale 4s linear infinite`,
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
