import { getColorCode } from "@/helper/color";

interface CostViewProps {
  color: number;
  value: number;
  side?: number;
}

export const CostView = ({ color, value, side = 8 }: CostViewProps) => {
  return (
    <div className="rounded-sm border-3 border-gray">
      <div className={`w-${side} h-${side} flex items-center justify-center font-bold ${getColorCode(color)}`}>
        {value}
      </div>
    </div>
  )
}