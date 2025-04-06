import { UnitView } from "@/component/ui/UnitView"
import { IUnit } from "@/submodule/suit/types"

interface FieldProps {
  units: IUnit[] | undefined
  isOwnField?: boolean
}

export const Field = ({ units, isOwnField = false }: FieldProps) => {
  return (
    <div className={`flex justify-center items-center gap-4 h-43`}>
      {(units ?? []).map((unit, i) => (
        <UnitView unit={unit} key={i} isOwnUnit={isOwnField} />
      ))}
    </div>
  )
}
