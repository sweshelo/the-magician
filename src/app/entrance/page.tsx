import { RoomCreator } from '@/feature/RoomCreator';
import { RoomEntrance } from '@/feature/RoomEntrance';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Entrance',
};

export default function Page() {
  return (
    <>
      <div className="space-y-4 m-4">
        <Link href={'/builder'}>デッキ編集</Link>
        <RoomCreator />
        <RoomEntrance />
      </div>
    </>
  );
}
