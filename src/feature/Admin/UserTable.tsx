'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setUserAdmin, updateUserCredits } from '@/actions/admin';
import type { Profile } from '@/type/supabase';

export function UserTable({ users }: { users: (Profile & { credits: number })[] }) {
  const router = useRouter();
  const [editingCredits, setEditingCredits] = useState<string | null>(null);
  const [editCreditsValue, setEditCreditsValue] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleStartEditCredits = (userId: string, currentCredits: number) => {
    setEditingCredits(userId);
    setEditCreditsValue(currentCredits);
  };

  const handleSaveCredits = async () => {
    if (!editingCredits) return;
    setError(null);
    const result = await updateUserCredits(editingCredits, editCreditsValue);
    if (result.success) {
      setEditingCredits(null);
      router.refresh();
    } else {
      setError(result.message ?? 'エラーが発生しました');
    }
  };

  const handleToggleAdmin = async (userId: string, currentIsAdmin: boolean) => {
    setError(null);
    const result = await setUserAdmin(userId, !currentIsAdmin);
    if (result.success) {
      router.refresh();
    } else {
      setError(result.message ?? 'エラーが発生しました');
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-600 text-red-200 rounded-md">
          {error}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-2">ユーザー</th>
              <th className="text-left py-2">Discord ID</th>
              <th className="text-left py-2">クレジット</th>
              <th className="text-left py-2">管理者</th>
              <th className="text-left py-2">登録日</th>
              <th className="text-left py-2"></th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-gray-700">
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    {user.avatar_url && (
                      <img src={user.avatar_url} alt="" className="w-6 h-6 rounded-full" />
                    )}
                    <span className="text-white">{user.discord_username}</span>
                  </div>
                </td>
                <td className="py-2 text-gray-400">{user.discord_id}</td>
                <td className="py-2">
                  {editingCredits === user.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        value={editCreditsValue}
                        onChange={e => setEditCreditsValue(Number(e.target.value))}
                        className="w-20 px-2 py-1 bg-gray-700 text-white rounded text-sm"
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleSaveCredits();
                          if (e.key === 'Escape') setEditingCredits(null);
                        }}
                      />
                      <button
                        onClick={handleSaveCredits}
                        className="px-2 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => setEditingCredits(null)}
                        className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs hover:bg-gray-500"
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEditCredits(user.id, user.credits)}
                      className="text-white hover:text-indigo-400 transition-colors"
                      title="クリックして編集"
                    >
                      {user.credits}
                    </button>
                  )}
                </td>
                <td className="py-2">
                  <button
                    onClick={() => handleToggleAdmin(user.id, user.is_admin ?? false)}
                    className={`px-2 py-1 rounded text-xs ${
                      user.is_admin ? 'bg-indigo-600 text-white' : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {user.is_admin ? '管理者' : '一般'}
                  </button>
                </td>
                <td className="py-2 text-gray-400">
                  {new Date(user.created_at).toLocaleDateString('ja-JP')}
                </td>
                <td className="py-2">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="text-indigo-400 hover:text-indigo-300 text-xs"
                  >
                    詳細
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
