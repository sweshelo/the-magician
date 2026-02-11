import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonColorScheme = 'indigo' | 'blue' | 'gray' | 'red' | 'green' | 'dark';

type Props = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  colorScheme?: ButtonColorScheme;
} & React.ComponentPropsWithoutRef<'button'>;

const variantColorStyles: Record<ButtonColorScheme, Record<ButtonVariant, string>> = {
  indigo: {
    primary:
      'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 border-transparent',
    secondary:
      'text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500 border-indigo-300',
    text: 'text-indigo-600 bg-transparent hover:bg-indigo-50 focus:ring-indigo-500 border-transparent',
  },
  blue: {
    primary: 'text-white bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 border-transparent',
    secondary: 'text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500 border-blue-300',
    text: 'text-blue-600 bg-transparent hover:bg-blue-50 focus:ring-blue-500 border-transparent',
  },
  gray: {
    primary: 'text-white bg-gray-500 hover:bg-gray-600 focus:ring-gray-500 border-transparent',
    secondary: 'text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500 border-gray-300',
    text: 'text-gray-600 bg-transparent hover:bg-gray-50 focus:ring-gray-500 border-transparent',
  },
  red: {
    primary: 'text-white bg-red-500 hover:bg-red-600 focus:ring-red-500 border-transparent',
    secondary: 'text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500 border-red-300',
    text: 'text-red-600 bg-transparent hover:bg-red-50 focus:ring-red-500 border-transparent',
  },
  green: {
    primary: 'text-white bg-green-500 hover:bg-green-600 focus:ring-green-500 border-transparent',
    secondary:
      'text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500 border-green-300',
    text: 'text-green-600 bg-transparent hover:bg-green-50 focus:ring-green-500 border-transparent',
  },
  dark: {
    primary: 'text-white bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 border-transparent',
    secondary: 'text-gray-300 bg-gray-700 hover:bg-gray-600 focus:ring-gray-500 border-gray-600',
    text: 'text-gray-400 bg-transparent hover:bg-gray-800 focus:ring-gray-500 border-transparent',
  },
};

export const Button: React.FC<Props> = ({
  variant = 'primary',
  size = 'md',
  colorScheme = 'indigo',
  className = '',
  type = 'submit',
  ...props
}) => {
  const variantStyles = variantColorStyles[colorScheme][variant];

  let sizeStyles = '';
  switch (size) {
    case 'sm':
      sizeStyles = 'py-1 px-2 text-xs';
      break;
    case 'md':
      sizeStyles = 'py-2 px-4 text-sm';
      break;
    case 'lg':
      sizeStyles = 'py-3 px-6 text-base';
      break;
  }

  return (
    <button
      type={type}
      className={`flex justify-center rounded-md border shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    />
  );
};
