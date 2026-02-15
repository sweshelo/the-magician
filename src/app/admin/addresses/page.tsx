import { getIpLogs } from '@/actions/admin';
import { IpLogTable } from '@/feature/Admin/IpLogTable';
import { Pagination } from '@/component/ui/Pagination';

export const dynamic = 'force-dynamic';

export default async function AddressesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const result = await getIpLogs({ page });
  const totalPages = Math.ceil(result.total / 50);

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-lg font-semibold text-white mb-4">接続IPログ ({result.total}件)</h2>

      {result.logs.length === 0 ? (
        <div className="text-gray-400">IPログがありません</div>
      ) : (
        <>
          <IpLogTable logs={result.logs} />
          <Pagination basePath="/admin/addresses" currentPage={page} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
