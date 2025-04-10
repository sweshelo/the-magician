"use client";

import { Toggle } from "@/app/component/interface/toggle";
import { UseFormRegisterReturn } from "react-hook-form";

interface FirstPlayerDrawToggleProps {
  registration: UseFormRegisterReturn;
}

export const FirstPlayerDrawToggle: React.FC<FirstPlayerDrawToggleProps> = ({
  registration,
}) => {
  return (
    <Toggle
      label="先攻1ターン目のドローを無効にする"
      registration={registration}
    />
  );
};
