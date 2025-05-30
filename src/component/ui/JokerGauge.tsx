interface JokerGaugeProps {
  percentage: number; // 0-100
}

export const JokerGauge = ({ percentage }: JokerGaugeProps) => {
  // Ensure percentage is between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className="relative w-58 h-5 bg-black rounded-sm border border-gray-600">
      {/* Gradient fill */}
      <div
        className="h-full rounded-sm bg-gradient-to-r from-red-800 to-red-400 transition-all duration-300"
        style={{ width: `${clampedPercentage}%` }}
      />

      {/* 25% interval markers */}
      <div className="absolute inset-0 flex justify-between items-center px-1">
        {[0, 25, 50, 75, 100].map(mark => (
          <div key={mark} className="w-0.5 h-3 bg-white opacity-70" />
        ))}
      </div>
    </div>
  );
};
