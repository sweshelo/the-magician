import Link from 'next/link';
import type { Profile } from '@/type/supabase';

type IpUser = {
  user_id: string;
  profile?: Profile | null;
  recorded_at: string;
};

export function IpUserTable({ users }: { users: IpUser[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-gray-400 border-b border-gray-700">
          <tr>
            <th className="py-2 px-3">ユーザー</th>
            <th className="py-2 px-3 hidden md:table-cell">Discord ID</th>
            <th className="py-2 px-3">最終記録日時</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.user_id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
              <td className="py-2 px-3">
                {user.profile ? (
                  <Link
                    href={`/admin/users/${user.user_id}`}
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    {user.profile.display_name || user.profile.discord_username}
                  </Link>
                ) : (
                  <span className="text-gray-400 font-mono text-xs">{user.user_id}</span>
                )}
              </td>
              <td className="py-2 px-3 text-gray-400 hidden md:table-cell">
                {user.profile?.discord_id ?? '-'}
              </td>
              <td className="py-2 px-3 text-gray-400">
                {new Date(user.recorded_at).toLocaleString('ja-JP')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
