import { MyTriggerZoneWrapper } from "./wrapper";
import { MyTriggerZoneBody } from "./body";

export const MyTriggerZone = () => {
  return (
    <div className="flex">
      <MyTriggerZoneWrapper>
        <MyTriggerZoneBody />
      </MyTriggerZoneWrapper>
    </div>
  );
};
