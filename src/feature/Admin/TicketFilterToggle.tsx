'use client';

import { useRouter } from 'next/navigation';

export function TicketFilterToggle({ showUsed }: { showUsed: boolean }) {
  const router = useRouter();

  return (
    <label className="flex items-center gap-2 text-gray-400">
      <input
        type="checkbox"
        checked={showUsed}
        onChange={e => {
          const params = new URLSearchParams();
          if (!e.target.checked) {
            params.set('showUsed', 'false');
          }
          const query = params.toString();
          router.push(`/admin/tickets${query ? `?${query}` : ''}`);
        }}
        className="rounded"
      />
      使用済みを表示
    </label>
  );
}
