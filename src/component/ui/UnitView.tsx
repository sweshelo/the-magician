import { IUnit } from "@/submodule/suit/types";
import { BPView } from "./BPView";
import { UnitIconView } from "./UnitIconView";
import { UnitActivatedView } from "./UnitActivatedView";
import catalog from "@/submodule/suit/catalog/catalog";

interface UnitViewProps {
  unit: IUnit
}

export const UnitView = ({ unit }: UnitViewProps) => {
  const color: string = ({
    1: 'orangered',
    2: 'gold',
    3: 'royalblue',
    4: 'mediumseagreen',
    5: 'darkviolet',
  })[catalog.get(unit.catalogId)?.color ?? 0] ?? ''

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        {/* Position components to layer correctly */}
        <div className="absolute inset-0 z-1">
          <UnitIconView
            color={color}
            image={`/image/card/full/${unit.catalogId}.jpg`}
          />
        </div>
        <div className="absolute inset-0 z-0">
          <UnitActivatedView color={color} active={unit.active} />
        </div>
      </div>
      <div className="-mt-2">
        <BPView bp={unit.bp.base + unit.bp.diff} lv={unit.lv} />
      </div>
    </div>
  );
};
