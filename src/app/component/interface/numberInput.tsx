"use client";

import { useEffect, useRef } from "react";
import { Tooltip } from "react-tooltip";
import { UseFormRegisterReturn } from "react-hook-form";

interface NumberInputProps {
  label: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  tooltipId?: string;
  tooltipContent?: string;
  registration: UseFormRegisterReturn;
  className?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  description,
  min = 0,
  max = 100,
  step = 1,
  tooltipId,
  tooltipContent,
  registration,
  className,
}) => {
  const rangeRef = useRef<HTMLInputElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);

  // Synchronize range and number inputs
  useEffect(() => {
    const handleRangeChange = (e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      if (numberRef.current) {
        numberRef.current.value = value;
      }
    };

    const handleNumberChange = (e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      if (rangeRef.current) {
        rangeRef.current.value = value;
      }
    };

    const rangeElement = rangeRef.current;
    const numberElement = numberRef.current;

    if (rangeElement) {
      rangeElement.addEventListener("input", handleRangeChange);
    }

    if (numberElement) {
      numberElement.addEventListener("input", handleNumberChange);
    }

    return () => {
      if (rangeElement) {
        rangeElement.removeEventListener("input", handleRangeChange);
      }
      if (numberElement) {
        numberElement.removeEventListener("input", handleNumberChange);
      }
    };
  }, []);

  return (
    <div className={`mb-3 ${className || ""}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {tooltipId && (
          <span
            data-tooltip-id={tooltipId}
            className="ml-1 text-gray-400 cursor-help"
          >
            ⓘ
          </span>
        )}
      </label>
      {description && (
        <div className="text-xs text-gray-500 mb-2">{description}</div>
      )}
      <div className="flex items-center space-x-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          className="w-full"
          {...registration}
          ref={(e) => {
            rangeRef.current = e;
            if (typeof registration.ref === "function") {
              registration.ref(e);
            }
          }}
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
          {...registration}
          ref={(e) => {
            numberRef.current = e;
            if (typeof registration.ref === "function") {
              registration.ref(e);
            }
          }}
        />
      </div>
      {tooltipId && tooltipContent && (
        <Tooltip id={tooltipId}>
          <span>{tooltipContent}</span>
        </Tooltip>
      )}
    </div>
  );
};
