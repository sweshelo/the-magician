'use server';

import { headers } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/server';

export async function recordIpAddress(userId: string): Promise<void> {
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
    await supabase.from('user_ip_logs').insert({ user_id: userId, ip_address: ip });
  }
}
