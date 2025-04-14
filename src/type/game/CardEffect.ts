/**
 * カード効果に関する型定義
 */

// カード効果の情報を表す型
export interface CardEffect {
  title: string; // 効果のタイトル（1行）
  message: string; // 効果の説明（最大4行）
}

// カード効果のペイロード型
export interface CardEffectPayload {
  type: 'CardEffect';
  effect: CardEffect;
}
