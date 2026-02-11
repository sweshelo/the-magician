// FIXME: TS 5.9 + Next.js 16.1.6 で 'next/navigation' から notFound をインポートすると TS2305 が発生するため内部パスを使用。
import { notFound } from 'next/dist/client/components/not-found';
import Link from 'next/link';
import { getPublicProfile, getProfileMatches } from '@/actions/profile';
import { MatchHistory } from '@/feature/Profile/MatchHistory';

export const dynamic = 'force-dynamic';

export default async function PublicProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const profileData = await getPublicProfile(id);

  if (!profileData) {
    notFound();
  }

  const { userName, stats } = profileData;

  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const matchData = await getProfileMatches(id, { page });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-6">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm mb-2 inline-block">
            &larr; TOPに戻る
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{userName}</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-gray-900">{stats.totalMatches}</div>
              <div className="text-xs text-gray-500">対戦数</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{stats.wins}</div>
              <div className="text-xs text-gray-500">勝利</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-600">{stats.losses}</div>
              <div className="text-xs text-gray-500">敗北</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-gray-900">{stats.winRate}%</div>
              <div className="text-xs text-gray-500">勝率</div>
            </div>
          </div>
        </div>

        <MatchHistory
          matches={matchData.matches}
          total={matchData.total}
          currentPage={page}
          basePath={`/profile/${id}`}
        />
      </div>
    </div>
  );
}
