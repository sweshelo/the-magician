import { IUnit } from "@/submodule/suit/types";
import { BPView } from "./BPView";
import { UnitIconView } from "./UnitIconView";
import catalog from "@/submodule/suit/catalog/catalog";
import { useState } from "react";

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

  const [active, setActive] = useState(true);

  return (
    <div className="flex flex-col items-center" onClick={() => setActive(prev => !prev)}>
      <UnitIconView
        color={color}
        image={`/image/card/full/${unit.catalogId}.jpg`}
        active={active}
      />
      <div className="-mt-2">
        <BPView bp={unit.bp} lv={unit.lv} />
      </div>
    </div>
  );
};
