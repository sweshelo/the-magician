'use server';

import { createClient } from '@/lib/supabase/server';

// ===== 型定義 =====

export type PlayCheckResponse = {
  canPlay: boolean;
  todayCount: number;
  dailyLimit: number;
  isPremium: boolean;
  message?: string;
};

export type PlayRecordRequest = {
  deckId?: string;
  roomId?: string;
};

export type PlayRecordResponse = {
  success: boolean;
  playLogId?: string;
  message?: string;
};

// ===== Server Actions =====

/**
 * プレイ可能かどうかを確認
 */
export async function checkCanPlay(): Promise<PlayCheckResponse> {
  // 認証スキップモードの場合は常にプレイ可能
  if (process.env.NEXT_PUBLIC_AUTH_SKIP === 'true') {
    return {
      canPlay: true,
      todayCount: 0,
      dailyLimit: 999,
      isPremium: true,
      message: '開発モード: 制限なし',
    };
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
      return {
        canPlay: true,
        todayCount: 0,
        dailyLimit: 999,
        isPremium: false,
        message: 'ゲストモード: 制限なし',
      };
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
      return {
        canPlay: true,
        todayCount: 0,
        dailyLimit: 999,
        isPremium: true,
        message: 'プレミアム会員: 無制限',
      };
    }

    // 今日のプレイ回数を取得（日本時間基準）
    const { data: countResult } = await supabase.rpc('get_today_play_count', {
      p_user_id: user.id,
    });

    const todayCount = countResult ?? 0;
    const canPlay = todayCount < dailyLimit;

    return {
      canPlay,
      todayCount,
      dailyLimit,
      isPremium: false,
      message: canPlay ? undefined : `本日のプレイ回数上限（${dailyLimit}回）に達しました`,
    };
  } catch (error) {
    console.error('プレイチェックエラー:', error);
    throw new Error('プレイ状態の確認に失敗しました');
  }
}

/**
 * プレイを記録
 */
export async function recordPlay(params?: PlayRecordRequest): Promise<PlayRecordResponse> {
  // 認証スキップモードの場合は記録しない
  if (process.env.NEXT_PUBLIC_AUTH_SKIP === 'true') {
    return {
      success: true,
      message: '開発モード: 記録スキップ',
    };
  }

  try {
    const supabase = await createClient();

    // 現在のユーザーを取得
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      // 未ログインユーザーは記録しない（ゲスト許可モード）
      return {
        success: true,
        message: 'ゲストモード: 記録スキップ',
      };
    }

    // プレイ可能かチェック
    const { data: canPlay } = await supabase.rpc('can_play', {
      p_user_id: user.id,
    });

    if (!canPlay) {
      return {
        success: false,
        message: '本日のプレイ回数上限に達しています',
      };
    }

    // プレイログを記録
    const { data: playLog, error: insertError } = await supabase
      .from('play_logs')
      .insert({
        user_id: user.id,
        deck_id: params?.deckId || null,
        room_id: params?.roomId || null,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('プレイログ記録エラー:', insertError);
      throw new Error('プレイの記録に失敗しました');
    }

    return {
      success: true,
      playLogId: playLog.id,
    };
  } catch (error) {
    console.error('プレイ記録エラー:', error);
    throw new Error('プレイの記録に失敗しました');
  }
}
