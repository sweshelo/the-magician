import Link from 'next/link';
import type { Profile, UserIpLog } from '@/type/supabase';

type IpLogWithProfile = UserIpLog & { profile?: Profile | null };

export function IpLogTable({ logs }: { logs: IpLogWithProfile[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-gray-400 border-b border-gray-700">
          <tr>
            <th className="py-2 px-3">ユーザー</th>
            <th className="py-2 px-3">IPアドレス</th>
            <th className="py-2 px-3 hidden md:table-cell">記録日時</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
              <td className="py-2 px-3">
                {log.profile ? (
                  <Link
                    href={`/admin/users/${log.user_id}`}
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    {log.profile.display_name || log.profile.discord_username}
                  </Link>
                ) : (
                  <span className="text-gray-400 font-mono text-xs">{log.user_id}</span>
                )}
              </td>
              <td className="py-2 px-3">
                <Link
                  href={`/admin/addresses/${encodeURIComponent(log.ip_address)}`}
                  className="font-mono text-indigo-400 hover:text-indigo-300"
                >
                  {log.ip_address}
                </Link>
              </td>
              <td className="py-2 px-3 text-gray-400 hidden md:table-cell">
                {new Date(log.recorded_at).toLocaleString('ja-JP')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
