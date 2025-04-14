import { UnitView } from '@/component/ui/UnitView';
import { useGameStore } from '@/hooks/game';

interface FieldProps {
  playerId: string;
  isOwnField?: boolean;
}

export const Field = ({ playerId, isOwnField = false }: FieldProps) => {
  const units = useGameStore.getState().players?.[playerId]?.field ?? [];

  return (
    <div className={`flex justify-center items-center gap-4 h-43`}>
      {(isOwnField ? [...(units ?? [])].reverse() : (units ?? [])).map(unit => (
        <UnitView unit={unit} key={unit.id} isOwnUnit={isOwnField} />
      ))}
    </div>
  );
};
