'use client';

import { useEffect, useState, useCallback } from 'react';
import { getUsers, setUserAdmin, updateUserCredits } from '@/actions/admin';
import type { Profile } from '@/type/supabase';

export default function UsersPage() {
  const [users, setUsers] = useState<(Profile & { credits: number })[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [userPage, setUserPage] = useState(1);

  const [editingCredits, setEditingCredits] = useState<string | null>(null);
  const [editCreditsValue, setEditCreditsValue] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getUsers({ page: userPage });
      setUsers(result.users);
      setUserCount(result.total);
    } catch {
      setError('データの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [userPage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
      loadData();
    } else {
      setError(result.message ?? 'エラーが発生しました');
    }
  };

  const handleToggleAdmin = async (userId: string, currentIsAdmin: boolean) => {
    const result = await setUserAdmin(userId, !currentIsAdmin);
    if (result.success) {
      loadData();
    } else {
      setError(result.message ?? 'エラーが発生しました');
    }
  };

  const totalPages = Math.ceil(userCount / 50);

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-600 text-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-white mb-4">ユーザー一覧 ({userCount}件)</h2>

        {isLoading ? (
          <div className="text-gray-400">読み込み中...</div>
        ) : users.length === 0 ? (
          <div className="text-gray-400">ユーザーがいません</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="text-left py-2">ユーザー</th>
                    <th className="text-left py-2">Discord ID</th>
                    <th className="text-left py-2">クレジット</th>
                    <th className="text-left py-2">管理者</th>
                    <th className="text-left py-2">登録日</th>
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
                          onClick={() => handleToggleAdmin(user.id, user.is_admin)}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ページネーション */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={() => setUserPage(p => p - 1)}
                  disabled={userPage <= 1}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  前へ
                </button>
                <span className="text-gray-300">
                  {userPage} / {totalPages}
                </span>
                <button
                  onClick={() => setUserPage(p => p + 1)}
                  disabled={userPage >= totalPages}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  次へ
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
