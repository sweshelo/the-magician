'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateDailyFreePlays } from '@/actions/admin';

export function ConfigForm({ initialDailyFreePlays }: { initialDailyFreePlays: number }) {
  const router = useRouter();
  const [newDailyFreePlays, setNewDailyFreePlays] = useState(initialDailyFreePlays);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleUpdateConfig = async () => {
    setError(null);
    setSuccessMessage(null);

    const result = await updateDailyFreePlays(newDailyFreePlays);
    if (result.success) {
      setSuccessMessage('設定を更新しました');
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
      {successMessage && (
        <div className="mb-4 p-3 bg-green-900 border border-green-600 text-green-200 rounded-md">
          {successMessage}
        </div>
      )}

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-white mb-4">システム設定</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">
              1日の無料プレイ回数 (現在: {initialDailyFreePlays}回)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={newDailyFreePlays}
                onChange={e => setNewDailyFreePlays(Number(e.target.value))}
                className="w-32 px-3 py-2 bg-gray-700 text-white rounded-md"
              />
              <button
                onClick={handleUpdateConfig}
                disabled={newDailyFreePlays === initialDailyFreePlays}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                更新
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
