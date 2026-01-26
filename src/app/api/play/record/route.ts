import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export type PlayRecordRequest = {
  deckId?: string;
  roomId?: string;
};

export type PlayRecordResponse = {
  success: boolean;
  playLogId?: string;
  message?: string;
};

/**
 * プレイを記録するAPI
 * POST /api/play/record
 */
export async function POST(request: Request) {
  // 認証スキップモードの場合は記録しない
  if (process.env.NEXT_PUBLIC_AUTH_SKIP === 'true') {
    return NextResponse.json<PlayRecordResponse>({
      success: true,
      message: '開発モード: 記録スキップ',
    });
  }

  try {
    const body: PlayRecordRequest = await request.json();
    const supabase = await createClient();

    // 現在のユーザーを取得
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      // 未ログインユーザーは記録しない（ゲスト許可モード）
      return NextResponse.json<PlayRecordResponse>({
        success: true,
        message: 'ゲストモード: 記録スキップ',
      });
    }

    // プレイ可能かチェック
    const { data: canPlay } = await supabase.rpc('can_play', {
      p_user_id: user.id,
    });

    if (!canPlay) {
      return NextResponse.json<PlayRecordResponse>(
        {
          success: false,
          message: '本日のプレイ回数上限に達しています',
        },
        { status: 403 }
      );
    }

    // プレイログを記録
    const { data: playLog, error: insertError } = await supabase
      .from('play_logs')
      .insert({
        user_id: user.id,
        deck_id: body.deckId || null,
        room_id: body.roomId || null,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('プレイログ記録エラー:', insertError);
      return NextResponse.json({ error: 'プレイの記録に失敗しました' }, { status: 500 });
    }

    return NextResponse.json<PlayRecordResponse>({
      success: true,
      playLogId: playLog.id,
    });
  } catch (error) {
    console.error('プレイ記録エラー:', error);
    return NextResponse.json({ error: 'プレイの記録に失敗しました' }, { status: 500 });
  }
}
