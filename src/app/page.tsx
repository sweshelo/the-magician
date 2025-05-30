import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'TOP',
};

export default function Home() {
  return (
    <div>
      <Link href={'/entrance'}>Visit Entrance →</Link>
    </div>
  );
}
