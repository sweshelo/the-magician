import Link from 'next/link';
// FIXME: TS 5.9 + Next.js 16.1.6 で 'next/navigation' から redirect をインポートすると TS2305 が発生するため内部パスを使用。
// 修正されたら `import { redirect } from 'next/navigation'` に戻すこと。
import { redirect } from 'next/dist/client/components/redirect';
import { checkIsAdmin } from '@/actions/admin';
import { AdminNav } from '@/feature/Admin/AdminNav';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const result = await checkIsAdmin();
  if (!result.isAdmin) {
    redirect('/entrance');
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
        <AdminNav />

        {children}
      </div>
    </div>
  );
}
