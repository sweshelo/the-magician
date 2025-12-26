import Link from 'next/link';
import React from 'react';

interface LinkCardProps {
  href: string;
  title: string;
  description?: string;
  icon?: string;
}

export const LinkCard: React.FC<LinkCardProps> = ({ href, title, description, icon }) => {
  return (
    <Link
      href={href}
      className="block bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow border border-gray-200"
    >
      <div className="flex items-center gap-4">
        {icon && <span className="text-2xl">{icon}</span>}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </div>
        <span className="text-xl text-gray-400">→</span>
      </div>
    </Link>
  );
};
