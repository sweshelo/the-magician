"use client";

import { ReactNode, useState } from "react";

interface SettingsGroupProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const SettingsGroup: React.FC<SettingsGroupProps> = ({
  title,
  children,
  defaultOpen = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`border border-gray-300 shadow rounded-lg py-1 px-2 mb-4 ${className}`}
    >
      <summary
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer py-1"
      >
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <span className="text-gray-500">{isOpen ? "▲" : "▼"}</span>
      </summary>
      {isOpen && <div className="pl-3 pt-2">{children}</div>}
    </div>
  );
};
