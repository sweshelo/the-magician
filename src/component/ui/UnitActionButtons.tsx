import React, { RefObject } from 'react';
import { useWebSocketGame } from '@/hooks/game';
import { useUnitSelection } from '@/hooks/unit-selection';
import { useAttackAnimation } from '@/hooks/attack-animation';
import { IUnit } from '@/submodule/suit/types';

interface UnitActionButtonsProps {
  unit: IUnit;
  unitRef: RefObject<HTMLDivElement | null>;
  canAttack?: boolean;
  canBoot?: boolean;
  canWithdraw?: boolean;
}

export const UnitActionButtons = ({
  unit,
  unitRef,
  canAttack = true,
  canBoot = true,
  canWithdraw = true,
}: UnitActionButtonsProps) => {
  const { activeUnit, setActiveUnit, candidate } = useUnitSelection();
  const { withdrawal } = useWebSocketGame();
  const { startAttackDeclaration } = useAttackAnimation();

  // Don't render buttons if not showing for this unit
  // We only pass this component when rendering units in player's field, so no need to check ownership
  if (activeUnit !== unit || candidate) {
    return null;
  }

  // Handle action button clicks
  const handleAttack = () => {
    console.log(`Unit ${unit.id} attacking`);

    // Get the current unit position from the DOM
    if (unitRef.current) {
      const rect = unitRef.current.getBoundingClientRect();
      const position = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      // Start the attack declaration animation with the actual unit position
      startAttackDeclaration(unit.id, true, position);
    } else {
      // Fallback if unitRef is not available
      startAttackDeclaration(unit.id, true, { x: 0, y: 0 });
    }

    setActiveUnit(undefined);
  };

  const handleWithdrawal = () => {
    console.log(`Unit ${unit.id} withdrawing`);
    // Implement withdrawal logic here
    setActiveUnit(undefined);
    withdrawal({ target: unit });
  };

  const handleBoot = () => {
    console.log(`Unit ${unit.id} booting`);
    // Implement boot logic here
    setActiveUnit(undefined);
  };

  return (
    <div className="absolute inset-0 pointer-events-auto z-5 flex flex-col justify-between px-2 py-1">
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
