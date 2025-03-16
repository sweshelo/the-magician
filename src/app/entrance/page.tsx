import { RoomCreator } from "@/feature/RoomCreator";
import { RoomEntrance } from "@/feature/RoomEntrance";

export default function Page() {
  return (
    <>
      <div className="space-y-4">
        <RoomCreator />
        <RoomEntrance />
      </div>
    </>
  )
}