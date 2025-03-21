import { BPView } from "./BPView";
import { UnitIconView } from "./UnitIconView";

interface UnitViewProps {
  color: string
  image?: string
}

export const UnitView = ({ color, image }: UnitViewProps) => {
  return (
    <div className="flex flex-col items-center">
      <UnitIconView color={color} image={image} />
      <div className="-mt-1">
        <BPView bp={1000} />
      </div>
    </div>
  );
};
