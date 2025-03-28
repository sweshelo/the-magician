import { IUnit } from "@/submodule/suit/types";
import { BPView } from "./BPView";
import { UnitIconView } from "./UnitIconView";

interface UnitViewProps {
  unit: IUnit
}

export const UnitView = ({ unit }: UnitViewProps) => {
  return (
    <div className="flex flex-col items-center">
      <UnitIconView color={'green'} image={`/image/card/full/${unit.catalogId}.jpg`} />
      <div className="-mt-1">
        <BPView bp={1000} />
      </div>
    </div>
  );
};
