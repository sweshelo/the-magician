import type { Ticket } from '@/type/supabase';

export function TicketList({ tickets }: { tickets: Ticket[] }) {
  if (tickets.length === 0) {
    return <div className="text-gray-400">チケットがありません</div>;
  }

  return (
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
  );
}
