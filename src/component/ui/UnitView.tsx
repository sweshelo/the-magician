import React, { useRef } from 'react';
import { IUnit } from '@/submodule/suit/types';

import { BPView } from './BPView';
import { UnitIconView } from './UnitIconView';
import { UnitActivatedView } from './UnitActivatedView';
import { UnitActionButtons } from './UnitActionButtons';
import { UnitSelectionButton } from './UnitSelectionButton';
import { UnitIconEffect } from './UnitIconEffect';
import { BattleIconsView } from './BattleIconsView';
import { useUnitSelection } from '@/hooks/unit-selection';
import catalog from '@/submodule/suit/catalog/catalog';
import { useSystemContext } from '@/hooks/system/hooks';
import { useUnitAttackAnimationStyle, useBPViewAnimationStyle } from '@/hooks/attack-animation';
import master from '@/submodule/suit/catalog/catalog';

interface UnitViewProps {
  unit: IUnit;
  backImage?: string;
  isOwnUnit?: boolean;
}

const UnitViewComponent = ({ unit, isOwnUnit = false }: UnitViewProps) => {
  const { setActiveUnit, candidate, animationUnit, setAnimationUnit, activeUnit } =
    useUnitSelection();
  const { setSelectedCard, setDetailCard, operable } = useSystemContext();
  const unitRef = useRef<HTMLDivElement>(null);

  const color: string =
    {
      1: 'orangered',
      2: 'gold',
      3: 'royalblue',
      4: 'mediumseagreen',
      5: 'darkviolet',
    }[catalog.get(unit.catalogId)?.color ?? 0] ?? '';

  // Handle unit click to show action buttons
  const handleUnitClick = () => {
    if (isOwnUnit && !candidate && operable) {
      setActiveUnit(prev => (prev?.id !== unit.id ? unit : undefined));
    }
    setSelectedCard(prev => (prev?.catalogId === unit.catalogId ? undefined : unit));
    setDetailCard(prev => (prev?.catalogId === unit.catalogId ? undefined : unit));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 unit-wrapper">
        {/* Action buttons (Attack/Withdrawal/Boot) - only shown for own units */}
        {isOwnUnit && activeUnit === unit && !candidate && (
          <div className="absolute inset-0 z-20 pointer-events-auto">
            <UnitActionButtons
              unit={unit}
              unitRef={unitRef}
              canAttack={unit.active}
              canBoot={!unit.active}
              canWithdraw={true}
            />
          </div>
        )}
        <div
          ref={unitRef}
          className="absolute inset-0 z-0"
          onClick={handleUnitClick}
          style={useUnitAttackAnimationStyle(unit.id)}
        >
          {/* Animation effect layer (highest z-index) */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <UnitIconEffect
              show={animationUnit === unit.id}
              onComplete={() => setAnimationUnit(undefined)}
            />
          </div>

          {/* Position components to layer correctly */}
          <div className="absolute inset-0 z-1">
            <UnitIconView
              color={color}
              image={`https://coj.sega.jp/player/img/${master.get(unit.catalogId)?.img}`}
              reversed={false}
            />
          </div>
          <div className="absolute inset-0 z-0">
            <UnitActivatedView color={color} active={unit.active} />
          </div>

          {/* Selection button (Select/Target/Block) - can be shown for any unit */}
          <UnitSelectionButton unitId={unit.id} />
        </div>
      </div>
      <div className="-mt-8" style={useBPViewAnimationStyle(unit.id)}>
        {unit.delta && <BattleIconsView delta={unit.delta} />}
        <BPView
          bp={unit.bp.base + unit.bp.diff - unit.bp.damage}
          diff={unit.bp.diff - unit.bp.damage}
          lv={unit.lv}
        />
      </div>
    </div>
  );
};

export const UnitView = React.memo(UnitViewComponent);
