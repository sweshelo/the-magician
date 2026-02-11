// FIXME: TS 5.9 + Next.js 16.1.6 で 'next/navigation' から redirect をインポートすると TS2305 が発生するため内部パスを使用。
import { redirect } from 'next/dist/client/components/redirect';
import Link from 'next/link';
import { getMyProfile, getMyMatches } from '@/actions/profile';
import { ProfileHeader } from '@/feature/Profile/ProfileHeader';
import { MatchHistory } from '@/feature/Profile/MatchHistory';

export const dynamic = 'force-dynamic';

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const profileData = await getMyProfile();

  if (!profileData) {
    redirect('/login');
  }

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const matchData = await getMyMatches({ page });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-6">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm mb-2 inline-block">
            &larr; TOPに戻る
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">マイページ</h1>
        </div>

        <ProfileHeader profile={profileData.profile} stats={profileData.stats} />

        <MatchHistory
          matches={matchData.matches}
          total={matchData.total}
          currentPage={page}
          basePath="/profile"
        />
      </div>
    </div>
  );
}
