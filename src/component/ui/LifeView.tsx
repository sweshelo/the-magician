import { colorTable } from "@/helper/color";

interface LifeViewProps {
  current: number;
  max: number;
}

export const LifeView = ({ current, max }: LifeViewProps) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <div className="flex min-w-[100px] justify-end">
        {Array.from({ length: max }).map((_, i) => (
          <span
            key={`life-${i}`}
            className={i < current ? colorTable.symbols.life : "text-gray-600"}
          >
            ❤️
          </span>
        ))}
      </div>
      <span className="w-10 text-right">
        {current}/{max}
      </span>
    </div>
  );
};
