interface CPViewProps {
  current: number | undefined;
  max: number;
}

export const PurpleGaugeView = ({ current, max }: CPViewProps) => {
  return current === undefined ? (
    <div className="w-38" />
  ) : (
    <div className="flex items-center justify-end gap-1 px-5 py-3 bg-purple-600 border-2 border-purple-900 rounded-lg">
      <div className="flex justify-end gap-[2px]">
        {Array.from({ length: max }).map((_, i) => (
          <div key={`cp-${i}`} className="relative h-6 w-5 flex items-center justify-center">
            <div
              className={`absolute inset-0 transform skew-x-[-15deg] ${
                i < current ? `bg-purple-400` : 'bg-gray-600/50 border-gray-600'
              } border`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
