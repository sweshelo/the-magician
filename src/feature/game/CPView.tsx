import { getColorCode } from "@/helper/color";

interface CPViewProps {
  color: number;
  value: number;
  side?: number;
}

export const CPView = ({ color, value, side = 8 }: CPViewProps) => {
  return (
    <div className="rounded-sm border-3 border-gray">
      <div className={`w-${side} h-${side} flex items-center justify-center font-bold ${getColorCode(color)}`}>
        {value}
      </div>
    </div>
  )
}