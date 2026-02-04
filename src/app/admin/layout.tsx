'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { checkIsAdmin } from '@/actions/admin';

const tabs = [
  { href: '/admin/tickets', label: 'チケット管理' },
  { href: '/admin/users', label: 'ユーザー管理' },
  { href: '/admin/config', label: 'システム設定' },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        const result = await checkIsAdmin();
        setIsAdmin(result.isAdmin);
        if (!result.isAdmin) {
          router.push('/entrance');
        }
      } catch {
        setIsAdmin(false);
        router.push('/entrance');
      }
    };
    check();
  }, [router]);

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">管理者ダッシュボード</h1>
          <Link
            href="/entrance"
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            エントランスへ戻る
          </Link>
        </div>

        {/* ナビゲーション */}
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

        {children}
      </div>
    </div>
  );
}
