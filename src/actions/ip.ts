'use server';

import { headers } from 'next/headers';
import { createClient, createAdminClient } from '@/lib/supabase/server';

// UUID v4形式の正規表現
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function recordIpAddress(guestId?: string): Promise<void> {
  // ログインユーザーの場合、セッションからIDを取得
  const supabaseAuth = await createClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  let userId: string;
  if (user) {
    userId = user.id;
  } else if (guestId && !UUID_REGEX.test(guestId)) {
    // ゲストの場合、UUID形式でないことを検証（なりすまし防止）
    userId = guestId;
  } else {
    return; // 認証もゲストIDもない、またはUUID形式のguestId（不正）
  }

  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'unknown';

  const supabase = createAdminClient();

  // 最新のレコードを取得
  const { data: latest } = await supabase
    .from('user_ip_logs')
    .select('ip_address')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(1)
    .single();

  // IPが変更された場合のみ記録
  if (!latest || latest.ip_address !== ip) {
    const { error } = await supabase
      .from('user_ip_logs')
      .insert({ user_id: userId, ip_address: ip });
    if (error) {
      console.error('IPアドレス記録エラー:', error);
    }
  }
}
