import { UnitView } from "@/component/ui/UnitView"
import { IUnit } from "@/submodule/suit/types"

interface FieldProps {
  units: IUnit[] | undefined
}

export const Field = ({ units }: FieldProps) => {
  return (
    <div className={`flex justify-center gap-4 h-48`}>
      {(units ?? []).map((unit, i) => (
        <UnitView unit={unit} key={i} />
      ))}
    </div>
  )
}