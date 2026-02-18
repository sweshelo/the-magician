import { DeckManagement } from '@/feature/DeckManagement';
import { Metadata } from 'next';
import { getMyProfile } from '@/actions/profile';
// FIXME: TS 5.9 + Next.js 16.1.6 で 'next/navigation' から redirect をインポートすると TS2305 が発生するため内部パスを使用。
import { redirect } from 'next/dist/client/components/redirect';

export const metadata: Metadata = {
  title: 'デッキ管理',
};

export default async function Page() {
  const profileData = await getMyProfile();

  if (!profileData) {
    redirect('/login');
  }

  return <DeckManagement />;
}
