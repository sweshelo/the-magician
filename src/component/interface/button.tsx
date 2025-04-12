import React from "react";

type ButtonVariant = "primary" | "secondary" | "text";
type ButtonSize = "sm" | "md" | "lg";

type Props = {
  variant?: ButtonVariant;
  size?: ButtonSize;
} & React.ComponentPropsWithoutRef<"button">;

export const Button: React.FC<Props> = ({ 
  variant = "primary", 
  size = "md", 
  className = "",
  type = "submit",
  ...props 
}) => {
  // Base styles
  let variantStyles = "";
  let sizeStyles = "";
  
  // Variant styles
  switch (variant) {
    case "primary":
      variantStyles = "text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 border-transparent";
      break;
    case "secondary":
      variantStyles = "text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500 border-indigo-300";
      break;
    case "text":
      variantStyles = "text-indigo-600 bg-transparent hover:bg-indigo-50 focus:ring-indigo-500 border-transparent";
      break;
  }
  
  // Size styles
  switch (size) {
    case "sm":
      sizeStyles = "py-1 px-2 text-xs";
      break;
    case "md":
      sizeStyles = "py-2 px-4 text-sm";
      break;
    case "lg":
      sizeStyles = "py-3 px-6 text-base";
      break;
  }
  
  return (
    <button
      type={type}
      className={`flex justify-center rounded-md shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    />
  );
};
