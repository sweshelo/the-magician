import Link from 'next/link';
import { Pagination } from '@/component/ui/Pagination';
import { DeckFullPreview } from '@/feature/Profile/DeckFullPreview';
import type { MatchWithOpponent } from '@/actions/profile';

function ResultBadge({ result }: { result: 'win' | 'lose' | 'unknown' }) {
  const styles = {
    win: 'bg-blue-100 text-blue-800',
    lose: 'bg-red-100 text-red-800',
    unknown: 'bg-gray-100 text-gray-800',
  };
  const labels = {
    win: '勝利',
    lose: '敗北',
    unknown: '不明',
  };

  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${styles[result]}`}>
      {labels[result]}
    </span>
  );
}

function MatchingModeBadge({ mode }: { mode: string | null }) {
  if (!mode) return <span className="text-gray-400 text-xs">-</span>;
  return <span className="text-xs text-gray-600">{mode}</span>;
}

export function MatchHistory({
  matches,
  total,
  currentPage,
  basePath,
}: {
  matches: MatchWithOpponent[];
  total: number;
  currentPage: number;
  basePath: string;
}) {
  const totalPages = Math.ceil(total / 20);
  const profileLinkPrefix = basePath.startsWith('/admin/') ? '/admin/users/' : '/profile/';

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">対戦履歴 ({total}件)</h3>
      </div>

      {matches.length === 0 ? (
        <div className="p-8 text-center text-gray-500">対戦履歴がありません</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    日時
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    結果
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                    種別
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                    R数
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                    先/後
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    対戦相手
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                    自分のデッキ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                    相手のデッキ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {matches.map(match => (
                  <tr key={match.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(match.started_at ?? match.ended_at ?? '').toLocaleString('ja-JP', {
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <ResultBadge result={match.result} />
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <MatchingModeBadge mode={match.matching_mode} />
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-gray-600">{match.total_rounds ?? '-'}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className={`text-xs font-medium ${match.me.is_first_player ? 'text-blue-600' : 'text-red-600'}`}
                      >
                        {match.me.is_first_player ? '先攻' : '後攻'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {match.opponent.id ? (
                        <Link
                          href={`${profileLinkPrefix}${match.opponent.id}`}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {match.opponent.name || '不明'}
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-900">
                          {match.opponent.name || '不明'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <DeckFullPreview deck={match.me.deck} />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <DeckFullPreview deck={match.opponent.deck} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <Pagination basePath={basePath} currentPage={currentPage} totalPages={totalPages} />
          </div>
        </>
      )}
    </div>
  );
}
