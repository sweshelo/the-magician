import { colorTable } from "@/helper/color";

interface CPViewProps {
  current: number;
  max: number;
}

export const CPView = ({ current, max }: CPViewProps) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <div className="flex min-w-[100px] justify-end">
        {Array.from({ length: max }).map((_, i) => (
          <span key={`cp-${i}`} className={i < current ? colorTable.symbols.cp : 'text-gray-600'}>
            ⚡️
          </span>
        ))}
      </div>
      <span className="w-10 text-right">
        {current}/{max}
      </span>
    </div>
  );
};
