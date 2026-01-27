import {
  checkCanPlay as checkCanPlayAction,
  recordPlay as recordPlayAction,
  type PlayCheckResponse,
  type PlayRecordRequest,
  type PlayRecordResponse,
} from '@/actions/play';

// 型を再エクスポート
export type { PlayCheckResponse, PlayRecordRequest, PlayRecordResponse };

/**
 * プレイ回数制限サービス
 * Server Actionsをラップして提供
 */
export const PlayLimitService = {
  /**
   * プレイ可能かどうかを確認
   */
  checkCanPlay: checkCanPlayAction,

  /**
   * プレイを記録
   */
  recordPlay: recordPlayAction,
};
