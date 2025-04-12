"use client";

import { UseFormRegisterReturn } from "react-hook-form";

interface ToggleProps {
  label: string;
  description?: string;
  tooltipId?: string;
  registration: UseFormRegisterReturn;
  className?: string;
  defaultChecked?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  description,
  tooltipId,
  registration,
  className,
  defaultChecked,
}) => {
  return (
    <div className={`mb-3 ${className || ""}`}>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {description && (
          <span
            className="text-xs text-gray-500 mb-2"
            {...(tooltipId ? { "data-tooltip-id": tooltipId } : {})}
          >
            {description}
          </span>
        )}
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-indigo-600"
            defaultChecked={defaultChecked}
            {...registration}
          />
          <span className="ml-2 text-sm text-gray-500">有効</span>
        </label>
      </div>
    </div>
  );
};
