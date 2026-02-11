import React from 'react';

type RichButtonColorScheme = 'red' | 'blue' | 'green' | 'indigo';

type RichButtonProps = {
  colorScheme?: RichButtonColorScheme;
} & React.ComponentPropsWithoutRef<'button'>;

const colorSchemeStyles: Record<RichButtonColorScheme, string> = {
  red: 'bg-red-700 border-red-900 hover:bg-red-600 hover:border-red-200',
  blue: 'bg-blue-700 border-blue-900 hover:bg-blue-600 hover:border-blue-200',
  green: 'bg-green-700 border-green-900 hover:bg-green-600 hover:border-green-200',
  indigo: 'bg-indigo-700 border-indigo-900 hover:bg-indigo-600 hover:border-indigo-200',
};

export const RichButton: React.FC<RichButtonProps> = ({
  colorScheme = 'red',
  className = '',
  ...props
}) => {
  return (
    <button
      className={`w-72 p-2 rounded-lg text-white border-2 shadow-lg cursor-pointer transition-colors disabled:opacity-50 ${colorSchemeStyles[colorScheme]} ${className}`}
      {...props}
    />
  );
};
