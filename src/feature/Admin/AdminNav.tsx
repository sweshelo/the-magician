'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/admin/tickets', label: 'チケット管理' },
  { href: '/admin/users', label: 'ユーザー管理' },
  { href: '/admin/matches', label: '対戦履歴' },
  { href: '/admin/config', label: 'システム設定' },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 mb-6">
      {tabs.map(tab => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`px-4 py-2 rounded-md transition-colors ${
            pathname === tab.href
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
