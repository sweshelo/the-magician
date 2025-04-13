export const HighlightBoarder = () => {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <div
        className="absolute border-2 rounded-lg w-4/5 h-4/5 animate-field-highlight"
        style={{ borderColor: 'rgba(255, 255, 255, 0.6)' }}
      />
    </div>
  );
};
