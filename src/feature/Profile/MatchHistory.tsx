import { getImageUrl } from '@/helper/image';
import master from '@/submodule/suit/catalog/catalog';
import { Pagination } from '@/component/ui/Pagination';
import type { MatchWithOpponent } from '@/actions/profile';

const DECK_PREVIEW_COUNT = 5;

function DeckPreview({ deck }: { deck: string[] | null }) {
  if (!deck || deck.length === 0) {
    return <span className="text-gray-400 text-xs">-</span>;
  }

  const previewCards = deck.slice(0, DECK_PREVIEW_COUNT);
  const remaining = deck.length - DECK_PREVIEW_COUNT;

  return (
    <div className="flex items-center gap-0.5">
      {previewCards.map((cardId, i) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={`${cardId}-${i}`}
          src={getImageUrl(cardId, 'small')}
          alt={master.get(cardId)?.name ?? cardId}
          title={master.get(cardId)?.name ?? cardId}
          className="w-7 h-7 object-cover rounded"
        />
      ))}
      {remaining > 0 && <span className="text-xs text-gray-400 ml-1">+{remaining}枚</span>}
    </div>
  );
}

function ResultBadge({ result }: { result: 'win' | 'lose' | 'draw' }) {
  const styles = {
    win: 'bg-blue-100 text-blue-800',
    lose: 'bg-red-100 text-red-800',
    draw: 'bg-gray-100 text-gray-800',
  };
  const labels = {
    win: '勝利',
    lose: '敗北',
    draw: '引分',
  };

  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${styles[result]}`}>
      {labels[result]}
    </span>
  );
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
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {match.opponent?.avatar_url && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={match.opponent.avatar_url}
                            alt=""
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <span className="text-sm text-gray-900">
                          {match.opponent?.display_name ??
                            match.opponent?.discord_username ??
                            '不明'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <DeckPreview deck={match.myDeck} />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <DeckPreview deck={match.opponentDeck} />
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
