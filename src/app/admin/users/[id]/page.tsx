import Link from 'next/link';
import { getUserProfile, getUserMatches } from '@/actions/profile';
import { ProfileHeader } from '@/feature/Profile/ProfileHeader';
import { MatchHistory } from '@/feature/Profile/MatchHistory';

export const dynamic = 'force-dynamic';

export default async function AdminUserDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);

  const profileData = await getUserProfile(id);

  if (!profileData) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg">
        <p className="text-gray-400">ユーザーが見つかりません</p>
        <Link
          href="/admin/users"
          className="text-indigo-400 hover:text-indigo-300 text-sm mt-4 inline-block"
        >
          &larr; ユーザー一覧へ戻る
        </Link>
      </div>
    );
  }

  const matchData = await getUserMatches(id, { page });

  return (
    <div className="space-y-6">
      <Link
        href="/admin/users"
        className="text-indigo-400 hover:text-indigo-300 text-sm inline-block"
      >
        &larr; ユーザー一覧へ戻る
      </Link>

      <ProfileHeader profile={profileData.profile} stats={profileData.stats} />

      <MatchHistory
        matches={matchData.matches}
        total={matchData.total}
        currentPage={page}
        basePath={`/admin/users/${id}`}
      />
    </div>
  );
}
