import { IUnit } from "@/submodule/suit/types";
import { BPView } from "./BPView";
import { UnitIconView } from "./UnitIconView";
import { UnitActivatedView } from "./UnitActivatedView";
import { UnitActionButtons } from "./UnitActionButtons";
import { UnitSelectionButton } from "./UnitSelectionButton";
import { useUnitSelection } from "@/hooks/unit-selection";
import catalog from "@/submodule/suit/catalog/catalog";

interface UnitViewProps {
  unit: IUnit
  backImage?: string
  isOwnUnit?: boolean
}

export const UnitView = ({ unit, isOwnUnit = false }: UnitViewProps) => {
  const { showActionButtons } = useUnitSelection();
  const color: string = ({
    1: 'orangered',
    2: 'gold',
    3: 'royalblue',
    4: 'mediumseagreen',
    5: 'darkviolet',
  })[catalog.get(unit.catalogId)?.color ?? 0] ?? ''

  // Handle unit click to show action buttons
  const handleUnitClick = () => {
    if (isOwnUnit) {
      showActionButtons(unit.id);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-32 h-32 unit-wrapper"
        onClick={isOwnUnit ? handleUnitClick : undefined}
      >
        {/* Position components to layer correctly */}
        <div className="absolute inset-0 z-1">
          <UnitIconView
            color={color}
            image={`/image/card/full/${unit.catalogId}.jpg`}
            reversed={false}
          />
        </div>
        <div className="absolute inset-0 z-0">
          <UnitActivatedView color={color} active={unit.active} />
        </div>

        {/* Action buttons (Attack/Withdrawal/Boot) - only shown for own units */}
        {isOwnUnit && (
          <UnitActionButtons
            unit={unit}
            canAttack={unit.active} // Example: Unit can only attack when active
            canBoot={!unit.active} // Example: Unit can only boot when not already active
            canWithdraw={true} // Always allow withdrawal
          />
        )}

        {/* Selection button (Select/Target/Block) - can be shown for any unit */}
        <UnitSelectionButton unitId={unit.id} />
      </div>
      <div className="-mt-2">
        <BPView bp={unit.bp.base + unit.bp.diff} lv={unit.lv} />
      </div>
    </div>
  );
};
