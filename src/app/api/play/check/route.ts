import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export type PlayCheckResponse = {
  canPlay: boolean;
  todayCount: number;
  dailyLimit: number;
  isPremium: boolean;
  message?: string;
};

/**
 * プレイ可能かどうかを確認するAPI
 * GET /api/play/check
 */
export async function GET() {
  // 認証スキップモードの場合は常にプレイ可能
  if (process.env.NEXT_PUBLIC_AUTH_SKIP === 'true') {
    return NextResponse.json<PlayCheckResponse>({
      canPlay: true,
      todayCount: 0,
      dailyLimit: 999,
      isPremium: true,
      message: '開発モード: 制限なし',
    });
  }

  try {
    const supabase = await createClient();

    // 現在のユーザーを取得
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      // 未ログインユーザーはゲストとして制限なし（ゲスト許可モード）
      return NextResponse.json<PlayCheckResponse>({
        canPlay: true,
        todayCount: 0,
        dailyLimit: 999,
        isPremium: false,
        message: 'ゲストモード: 制限なし',
      });
    }

    // サブスクリプション情報を取得
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('daily_play_limit, valid_until, plan')
      .eq('user_id', user.id)
      .single();

    const dailyLimit = subscription?.daily_play_limit ?? 3;
    const validUntil = subscription?.valid_until ? new Date(subscription.valid_until) : null;
    const isPremium = validUntil ? validUntil > new Date() : false;

    // プレミアムユーザーは無制限
    if (isPremium) {
      return NextResponse.json<PlayCheckResponse>({
        canPlay: true,
        todayCount: 0,
        dailyLimit: 999,
        isPremium: true,
        message: 'プレミアム会員: 無制限',
      });
    }

    // 今日のプレイ回数を取得（日本時間基準）
    const { data: countResult } = await supabase.rpc('get_today_play_count', {
      p_user_id: user.id,
    });

    const todayCount = countResult ?? 0;
    const canPlay = todayCount < dailyLimit;

    return NextResponse.json<PlayCheckResponse>({
      canPlay,
      todayCount,
      dailyLimit,
      isPremium: false,
      message: canPlay ? undefined : `本日のプレイ回数上限（${dailyLimit}回）に達しました`,
    });
  } catch (error) {
    console.error('プレイチェックエラー:', error);
    return NextResponse.json({ error: 'プレイ状態の確認に失敗しました' }, { status: 500 });
  }
}
