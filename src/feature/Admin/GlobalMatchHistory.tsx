import Link from 'next/link';
import { Pagination } from '@/component/ui/Pagination';
import { DeckFullPreview } from '@/feature/Profile/DeckFullPreview';
import type { GlobalMatchEntry } from '@/actions/profile';

function WinnerBadge({
  playerIndex,
  winnerIndex,
}: {
  playerIndex: number;
  winnerIndex: number | null;
}) {
  if (winnerIndex === null) {
    return (
      <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-800">
        -
      </span>
    );
  }
  if (winnerIndex === playerIndex) {
    return (
      <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800">
        勝利
      </span>
    );
  }
  return (
    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-red-100 text-red-800">
      敗北
    </span>
  );
}

function PlayerCell({
  player,
  playerIndex,
  winnerIndex,
  firstPlayerIndex,
}: {
  player: { id: string; name: string };
  playerIndex: number;
  winnerIndex: number | null;
  firstPlayerIndex: number | null;
}) {
  return (
    <div className="flex items-center gap-2">
      <WinnerBadge playerIndex={playerIndex} winnerIndex={winnerIndex} />
      {firstPlayerIndex === playerIndex && (
        <span className="text-xs font-medium text-blue-600">先</span>
      )}
      {firstPlayerIndex !== null && firstPlayerIndex !== playerIndex && (
        <span className="text-xs font-medium text-red-600">後</span>
      )}
      {player.id ? (
        <Link
          href={`/admin/users/${player.id}`}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          {player.name || '不明'}
        </Link>
      ) : (
        <span className="text-sm text-gray-900">{player.name || '不明'}</span>
      )}
    </div>
  );
}

export function GlobalMatchHistory({
  matches,
  total,
  currentPage,
  basePath,
}: {
  matches: GlobalMatchEntry[];
  total: number;
  currentPage: number;
  basePath: string;
}) {
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">全対戦履歴 ({total}件)</h3>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                    種別
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                    R数
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    プレイヤー1
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                    デッキ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    プレイヤー2
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                    デッキ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {matches.map(match => (
                  <tr key={match.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {match.started_at || match.ended_at
                        ? new Date(match.started_at ?? match.ended_at ?? '').toLocaleString(
                            'ja-JP',
                            {
                              month: 'numeric',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )
                        : '-'}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {match.matching_mode ? (
                        <span className="text-xs text-gray-600">{match.matching_mode}</span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-gray-600">{match.total_rounds ?? '-'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <PlayerCell
                        player={match.player1}
                        playerIndex={0}
                        winnerIndex={match.winner_index}
                        firstPlayerIndex={match.first_player_index}
                      />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <DeckFullPreview deck={match.player1.deck} />
                    </td>
                    <td className="px-4 py-3">
                      <PlayerCell
                        player={match.player2}
                        playerIndex={1}
                        winnerIndex={match.winner_index}
                        firstPlayerIndex={match.first_player_index}
                      />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <DeckFullPreview deck={match.player2.deck} />
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
