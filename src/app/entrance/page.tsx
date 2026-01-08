import { RoomCreator } from '@/feature/RoomCreator';
import { RoomEntrance } from '@/feature/RoomEntrance';
import { EntranceMenu } from '@/feature/EntranceMenu';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Entrance',
};

export default function Page() {
  return (
    <>
      <div className="space-y-4 m-4">
        <div className="flex gap-4">
          <Link
            href={'/builder'}
            className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            デッキ編集
          </Link>
          <Link
            href={'/matching'}
            className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 transition-colors font-bold shadow-lg"
          >
            🎮 マッチング
          </Link>
        </div>
        <EntranceMenu />
        <RoomCreator />
        <RoomEntrance />
      </div>
    </>
  );
}
