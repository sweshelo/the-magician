import { IUnit } from "@/submodule/suit/types";
import { BPView } from "./BPView";
import { UnitIconView } from "./UnitIconView";
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
      <UnitIconView
        color={color}
        image={`/image/card/full/${unit.catalogId}.jpg`}
        active={unit.active}
      />
      <div className="-mt-2">
        <BPView bp={unit.bp.base + unit.bp.diff} lv={unit.lv} />
      </div>
    </div>
  );
};
