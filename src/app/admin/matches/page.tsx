import { getAllMatches } from '@/actions/profile';
import { GlobalMatchHistory } from '@/feature/Admin/GlobalMatchHistory';

export const dynamic = 'force-dynamic';

export default async function AdminMatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);

  const matchData = await getAllMatches({ page });

  return (
    <div className="space-y-6">
      <GlobalMatchHistory
        matches={matchData.matches}
        total={matchData.total}
        currentPage={page}
        basePath="/admin/matches"
      />
    </div>
  );
}
