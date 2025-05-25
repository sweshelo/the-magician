interface CPViewProps {
  current: number;
  max: number;
}

export const CPView = ({ current, max }: CPViewProps) => {
  return (
    <div className="flex items-center justify-end p-2 border-2 border-gray-500 bg-gray-800 rounded-lg">
      <span className="text-right mx-2">{current}</span>
      <div className="flex justify-start gap-[2px] px-1 min-w-64">
        {Array.from({ length: Math.max(max, current) }).map((_, i) => (
          <div key={`cp-${i}`} className="relative h-5 w-4 flex items-center justify-center">
            <div
              className={`absolute inset-0 transform skew-x-[15deg] ${
                i < current ? `bg-pink-400` : i < max ? 'bg-gray-600/50 border-gray-600' : ''
              } border`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
