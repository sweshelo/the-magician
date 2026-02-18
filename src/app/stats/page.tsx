/* eslint-disable react-hooks/error-boundaries */
// (サーバコンポーネントなので無効化する)

import { Metadata } from 'next';
import { getWeightedRanking } from '@/actions/ranking';
import { ORIGINALITY_TIERS } from '@/actions/ranking.types';
import type { RankingEntry } from '@/actions/ranking.types';
import { getImageUrl } from '@/helper/image';
import Link from 'next/link';

export const revalidate = 604800;

export const metadata: Metadata = {
  title: '統計 - 使用カードランキング',
};

const colorClasses: Record<number, string> = {
  0: 'bg-gray-400 text-white',
  1: 'bg-red-600 text-white',
  2: 'bg-yellow-500 text-white',
  3: 'bg-blue-500 text-white',
  4: 'bg-green-500 text-white',
  5: 'bg-purple-600 text-white',
};

const rarityLabels: Record<string, string> = {
  c: 'C',
  uc: 'UC',
  r: 'R',
  vr: 'VR',
  sr: 'SR',
  pr: 'PR',
  sp: 'SP',
};

const rarityClasses: Record<string, string> = {
  c: 'bg-gray-200 text-gray-700',
  uc: 'bg-green-100 text-green-800',
  r: 'bg-blue-100 text-blue-800',
  vr: 'bg-purple-100 text-purple-800',
  sr: 'bg-yellow-100 text-yellow-800',
  pr: 'bg-pink-100 text-pink-800',
  sp: 'bg-red-100 text-red-800',
};

const typeLabels: Record<string, string> = {
  unit: 'ユニット',
  advanced_unit: '進化',
  trigger: 'トリガー',
  intercept: 'インターセプト',
  virus: 'ウイルス',
  joker: 'ジョーカー',
};

export default async function StatsPage() {
  try {
    const { ranking, totalMatches, generatedAt } = await getWeightedRanking();

    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
        <div className="text-center mb-8">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm mb-2 inline-block">
            &larr; TOPに戻る
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">使用カードランキング</h1>
          <p className="text-gray-600">
            直近3週間 {totalMatches.toLocaleString()} 試合のデッキデータから重み付き集計
          </p>
          <p className="text-gray-400 text-xs mt-1">
            最終更新: {new Date(generatedAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
          </p>
        </div>

        <div className="w-full max-w-4xl">
          {ranking.length === 0 ? (
            <div className="bg-white rounded-lg p-8 shadow text-center text-gray-500">
              データがありません
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-12">
                      #
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      カード
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20 hidden sm:table-cell">
                      レアリティ
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24 hidden sm:table-cell">
                      タイプ
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16 hidden sm:table-cell">
                      コスト
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase w-20">
                      使用ポイント
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ranking.map(entry => {
                    const tier = ORIGINALITY_TIERS.find(
                      t =>
                        entry.rank >= t.startRank && (t.endRank === null || entry.rank <= t.endRank)
                    );
                    const showTierHeader = tier && entry.rank === tier.startRank;

                    return (
                      <RankingRow
                        key={entry.cardId}
                        entry={entry}
                        tierHeader={showTierHeader ? tier.label : undefined}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  } catch {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
        <p>ランキングは現在ご利用頂けません。</p>
      </div>
    );
  }
}

function RankingRow({ entry, tierHeader }: { entry: RankingEntry; tierHeader?: string }) {
  return (
    <>
      {tierHeader && (
        <tr className="bg-gray-800">
          <td colSpan={6} className="px-4 py-2 text-sm font-bold text-white tracking-wide">
            {tierHeader}
          </td>
        </tr>
      )}
      <tr className="hover:bg-gray-50">
        <td className="px-3 py-2 text-sm font-medium text-gray-500">{entry.rank}</td>
        <td className="px-3 py-2">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImageUrl(entry.cardId, 'small')}
              alt={entry.name}
              className="w-10 h-10 object-cover rounded"
            />
            <span className="text-sm font-medium text-gray-900">{entry.name}</span>
          </div>
        </td>
        <td className="px-3 py-2 hidden sm:table-cell">
          {entry.rarity && (
            <span
              className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${rarityClasses[entry.rarity] ?? ''}`}
            >
              {rarityLabels[entry.rarity] ?? entry.rarity}
            </span>
          )}
        </td>
        <td className="px-3 py-2 text-xs text-gray-600 hidden sm:table-cell">
          {entry.type ? (typeLabels[entry.type] ?? entry.type) : '-'}
        </td>
        <td className="px-3 py-2 hidden sm:table-cell">
          {entry.rarity && (
            <span
              className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-bold ${colorClasses[entry.color] ?? 'bg-gray-400 text-white'}`}
            >
              {entry.cost}
            </span>
          )}
        </td>
        <td className="px-3 py-2 text-right text-sm font-semibold text-gray-700">
          {entry.useCount.toLocaleString()}
        </td>
      </tr>
    </>
  );
}
