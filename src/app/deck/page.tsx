import { DeckManagement } from '@/feature/DeckManagement';
import { Metadata } from 'next';
import { createClient, isSupabasePublicConfigured } from '@/lib/supabase/server';
// FIXME: TS 5.9 + Next.js 16.1.6 で 'next/navigation' から redirect をインポートすると TS2305 が発生するため内部パスを使用。
import { redirect } from 'next/dist/client/components/redirect';

export const metadata: Metadata = {
  title: 'デッキ管理',
};

export default async function Page() {
  // Supabaseが設定されていない場合はLocalStorageベースのデッキビルダーへ
  if (!isSupabasePublicConfigured()) {
    redirect('/builder');
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <DeckManagement />;
}
