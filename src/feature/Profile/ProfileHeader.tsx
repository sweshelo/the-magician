import type { Profile } from '@/type/supabase';
import type { ProfileStats } from '@/actions/profile';

export function ProfileHeader({ profile, stats }: { profile: Profile; stats: ProfileStats }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center gap-4">
        {profile.avatar_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-2xl font-bold">
            {(profile.display_name ?? profile.discord_username).charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">
            {profile.display_name ?? profile.discord_username}
          </h2>
          <p className="text-sm text-gray-500">@{profile.discord_username}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-4 text-center">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-gray-900">{stats.totalMatches}</div>
          <div className="text-xs text-gray-500">対戦数</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-600">{stats.wins}</div>
          <div className="text-xs text-gray-500">勝利</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-red-600">{stats.losses}</div>
          <div className="text-xs text-gray-500">敗北</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-gray-900">{stats.winRate}%</div>
          <div className="text-xs text-gray-500">勝率</div>
        </div>
      </div>
    </div>
  );
}
