import type { PlayCheckResponse } from '@/app/api/play/check/route';
import type { PlayRecordRequest, PlayRecordResponse } from '@/app/api/play/record/route';

/**
 * プレイ回数制限サービス
 */
export const PlayLimitService = {
  /**
   * プレイ可能かどうかを確認
   */
  async checkCanPlay(): Promise<PlayCheckResponse> {
    const response = await fetch('/api/play/check');

    if (!response.ok) {
      throw new Error('プレイ状態の確認に失敗しました');
    }

    return response.json();
  },

  /**
   * プレイを記録
   */
  async recordPlay(params?: PlayRecordRequest): Promise<PlayRecordResponse> {
    const response = await fetch('/api/play/record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params ?? {}),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'プレイの記録に失敗しました');
    }

    return response.json();
  },
};
