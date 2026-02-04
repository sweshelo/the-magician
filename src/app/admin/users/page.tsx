import { getUsers } from '@/actions/admin';
import { UserTable } from '@/feature/Admin/UserTable';
import { Pagination } from '@/component/ui/Pagination';

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const result = await getUsers({ page });
  const totalPages = Math.ceil(result.total / 50);

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-lg font-semibold text-white mb-4">ユーザー一覧 ({result.total}件)</h2>

      {result.users.length === 0 ? (
        <div className="text-gray-400">ユーザーがいません</div>
      ) : (
        <>
          <UserTable users={result.users} />
          <Pagination basePath="/admin/users" currentPage={page} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
