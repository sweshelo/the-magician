import { RoomCreator } from '@/feature/RoomCreator';
import { RoomEntrance } from '@/feature/RoomEntrance';
import { EntranceMenu } from '@/feature/EntranceMenu';
import { Matching } from '@/feature/Matching';
import { Metadata } from 'next';
import Link from 'next/link';
import { getMyProfile } from '@/actions/profile';
// FIXME: TS 5.9 + Next.js 16.1.6 で 'next/navigation' から redirect をインポートすると TS2305 が発生するため内部パスを使用。
import { redirect } from 'next/dist/client/components/redirect';

export const metadata: Metadata = {
  title: 'Entrance',
};

export default async function Page() {
  const profileData = process.env.DISABLE_AUTH === 'true' ? 'SKIP' : await getMyProfile();

  if (!profileData) {
    redirect('/login');
  }

  return (
    <>
      <div className="space-y-4 m-4">
        <Link
          href={'/builder'}
          className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          デッキ編集
        </Link>
        <EntranceMenu />
        {process.env.DISABLE_AUTH !== 'true' && <Matching />}
        {process.env.DISABLE_ROOM_CREATION === 'true' ? (
          <div className="max-w-lg mx-auto text-center p-3 my-3 bg-red-900 border border-red-600 rounded-md">
            <p className="text-red-200 text-sm">
              現在公式サーバ上ではルーム作成機能を提供しておりません
              <br />
              ランダムマッチングをお楽しみ下さい
              <br />
              <span className="text-[10px] text-red-100">
                公開されているソースコードを利用して個人サーバを建てることで
                <br />
                引き続きルーム作成機能を利用することが出来ます
              </span>
            </p>
          </div>
        ) : (
          <>
            <RoomCreator />
            <RoomEntrance />
          </>
        )}
      </div>
    </>
  );
}
