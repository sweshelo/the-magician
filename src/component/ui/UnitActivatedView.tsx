export const UnitActivatedView = ({ color, active = true }: { color: string, active: boolean }) => {
  // Generate tick marks for the clock effect
  const tickMarks = Array.from({ length: 60 }).map((_, i) => {
    const angle = (i * 360) / 60;
    const radians = (angle * Math.PI) / 180;
    // Calculate start and end positions for each tick mark
    const innerRadius = 53; // Where tick mark starts
    const outerRadius = innerRadius + 3 + (i % 2) * 2; // Length as specified in props

    const startX = 50 + innerRadius * Math.cos(radians);
    const startY = 60 + innerRadius * Math.sin(radians);
    const endX = 50 + outerRadius * Math.cos(radians);
    const endY = 60 + outerRadius * Math.sin(radians);

    return (
      <line
        key={i}
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={'white'}
        strokeWidth={1}
      />
    );
  });

  return (
    <>
      {/* Clock effect circle with tick marks - using the CSS class we added */}
      <svg
        viewBox="0 0 100 120"
        className="absolute top-0 left-0 w-full h-full z-0"
        style={{
          animation: `rotate ${15}s linear infinite`,
          opacity: active ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      >
        {/* White outline */}
        <circle
          cx="50"
          cy="60"
          r="52"
          fill="none"
          stroke='white'
          strokeWidth="2"
        />
        {/* Semi-transparent colored circle */}
        <circle
          cx="50"
          cy="60"
          r="52"
          fill="none"
          stroke={color}
          strokeWidth="15"
          opacity="0.7"
        />
        {tickMarks}
      </svg>
    </>
  )
}