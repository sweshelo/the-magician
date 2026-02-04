'use client';

import { useEffect, useState, useCallback } from 'react';
import { getTickets, createTickets, type CreateTicketRequest } from '@/actions/admin';
import type { Ticket } from '@/type/supabase';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketCount, setTicketCount] = useState(0);
  const [showUsedTickets, setShowUsedTickets] = useState(true);
  const [newTicketCredits, setNewTicketCredits] = useState(10);
  const [newTicketCount, setNewTicketCount] = useState(1);
  const [newTicketExpiry, setNewTicketExpiry] = useState<'30days' | '90days' | 'never'>('30days');
  const [createdTickets, setCreatedTickets] = useState<{ id: string; code: string }[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getTickets({ showUsed: showUsedTickets });
      setTickets(result.tickets);
      setTicketCount(result.total);
    } catch {
      setError('データの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [showUsedTickets]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateTickets = async () => {
    setError(null);
    setSuccessMessage(null);
    setCreatedTickets([]);

    const expiresAt =
      newTicketExpiry === 'never'
        ? null
        : newTicketExpiry === '90days'
          ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const request: CreateTicketRequest = {
      credits: newTicketCredits,
      count: newTicketCount,
      expiresAt,
    };

    const result = await createTickets(request);
    if (result.success) {
      setCreatedTickets(result.tickets);
      setSuccessMessage(`${result.tickets.length}件のチケットを発行しました`);
      loadData();
    } else {
      setError(result.message ?? 'エラーが発生しました');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccessMessage('コピーしました');
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch {
      setError('コピーに失敗しました');
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-600 text-red-200 rounded-md">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-900 border border-green-600 text-green-200 rounded-md">
          {successMessage}
        </div>
      )}

      <div className="space-y-6">
        {/* チケット発行フォーム */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-white mb-4">チケット発行</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">クレジット数</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={newTicketCredits}
                onChange={e => setNewTicketCredits(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">発行枚数</label>
              <input
                type="number"
                min="1"
                max="100"
                value={newTicketCount}
                onChange={e => setNewTicketCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">有効期限</label>
              <select
                value={newTicketExpiry}
                onChange={e => setNewTicketExpiry(e.target.value as '30days' | '90days' | 'never')}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md"
              >
                <option value="30days">30日間</option>
                <option value="90days">90日間</option>
                <option value="never">無期限</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleCreateTickets}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                発行
              </button>
            </div>
          </div>

          {/* 発行されたチケット */}
          {createdTickets.length > 0 && (
            <div className="mt-4 p-4 bg-gray-700 rounded-md">
              <h3 className="text-white font-medium mb-2">発行されたチケットコード:</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {createdTickets.map(ticket => (
                  <div key={ticket.id} className="flex items-center gap-2">
                    <code className="flex-1 px-2 py-1 bg-gray-800 text-green-400 rounded font-mono">
                      {ticket.code}
                    </code>
                    <button
                      onClick={() => copyToClipboard(ticket.code)}
                      className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-500"
                    >
                      コピー
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => copyToClipboard(createdTickets.map(t => t.code).join('\n'))}
                className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                全てコピー
              </button>
            </div>
          )}
        </div>

        {/* チケット一覧 */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">チケット一覧 ({ticketCount}件)</h2>
            <label className="flex items-center gap-2 text-gray-400">
              <input
                type="checkbox"
                checked={showUsedTickets}
                onChange={e => setShowUsedTickets(e.target.checked)}
                className="rounded"
              />
              使用済みを表示
            </label>
          </div>

          {isLoading ? (
            <div className="text-gray-400">読み込み中...</div>
          ) : tickets.length === 0 ? (
            <div className="text-gray-400">チケットがありません</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="text-left py-2">コード</th>
                    <th className="text-left py-2">クレジット</th>
                    <th className="text-left py-2">状態</th>
                    <th className="text-left py-2">有効期限</th>
                    <th className="text-left py-2">作成日</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(ticket => (
                    <tr key={ticket.id} className="border-b border-gray-700">
                      <td className="py-2">
                        <code className="text-green-400 font-mono">{ticket.code}</code>
                      </td>
                      <td className="py-2 text-white">{ticket.credits}</td>
                      <td className="py-2">
                        {ticket.owner_id ? (
                          <span className="text-gray-400">使用済み</span>
                        ) : ticket.expires_at && new Date(ticket.expires_at) < new Date() ? (
                          <span className="text-red-400">期限切れ</span>
                        ) : (
                          <span className="text-green-400">有効</span>
                        )}
                      </td>
                      <td className="py-2 text-gray-400">
                        {ticket.expires_at
                          ? new Date(ticket.expires_at).toLocaleDateString('ja-JP')
                          : '無期限'}
                      </td>
                      <td className="py-2 text-gray-400">
                        {new Date(ticket.created_at).toLocaleDateString('ja-JP')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
