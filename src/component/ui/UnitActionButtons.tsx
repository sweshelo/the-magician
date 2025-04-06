import { useWebSocketGame } from "@/hooks/game";
import { useUnitSelection } from "@/hooks/unit-selection";
import { IUnit } from "@/submodule/suit/types";

interface UnitActionButtonsProps {
  unit: IUnit;
  canAttack?: boolean;
  canBoot?: boolean;
  canWithdraw?: boolean;
}

export const UnitActionButtons = ({
  unit,
  canAttack = true,
  canBoot = true,
  canWithdraw = true
}: UnitActionButtonsProps) => {
  const { actionButtonUnitId, hideActionButtons } = useUnitSelection();
  const { withdrawal } = useWebSocketGame()

  // Don't render buttons if not showing for this unit
  // We only pass this component when rendering units in player's field, so no need to check ownership
  if (actionButtonUnitId !== unit.id) {
    return null;
  }

  // Handle action button clicks
  const handleAttack = () => {
    console.log(`Unit ${unit.id} attacking`);
    // Implement attack logic here
    hideActionButtons();
  };

  const handleWithdrawal = () => {
    console.log(`Unit ${unit.id} withdrawing`);
    // Implement withdrawal logic here
    hideActionButtons();
    withdrawal({ target: unit })
  };

  const handleBoot = () => {
    console.log(`Unit ${unit.id} booting`);
    // Implement boot logic here
    hideActionButtons();
  };

  return (
    <div className="absolute inset-0 pointer-events-auto z-20 flex flex-col justify-between px-2 py-1">
      {/* Attack Button (top) */}
      {canAttack ? (
        <button
          className="action-button bg-red-500 text-white py-1 rounded-md shadow-md border border-red-700 hover:bg-red-600 w-full opacity-90"
          onClick={handleAttack}
        >
          アタック
        </button>
      ) : (
        <div className="h-8"></div> /* Placeholder to maintain spacing */
      )}

      {/* Boot Button (middle) */}
      {canBoot ? (
        <button
          className="action-button bg-pink-500 text-white py-1 rounded-md shadow-md border border-pink-700 hover:bg-pink-600 w-full opacity-90"
          onClick={handleBoot}
        >
          起動
        </button>
      ) : (
        <div className="h-8"></div> /* Placeholder to maintain spacing */
      )}

      {/* Withdrawal Button (bottom) */}
      {canWithdraw ? (
        <button
          className="action-button bg-blue-500 text-white py-1 rounded-md shadow-md border border-blue-700 hover:bg-blue-600 w-full opacity-90"
          onClick={handleWithdrawal}
        >
          撤退
        </button>
      ) : (
        <div className="h-8"></div> /* Placeholder to maintain spacing */
      )}
    </div>
  );
};
