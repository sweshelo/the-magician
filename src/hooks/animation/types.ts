'use client';

export enum EffectType {
  SELECT = 'select', // 選択エフェクト
  OVERCLOCK = 'overclock', // オーバークロックエフェクト
  STATUS_CHANGE = 'status_change', // ステータス変動表示
  DAMAGE = 'damage', // ダメージ表示
  LEVEL_UP = 'level_up', // レベルアップ表示
}

export interface AnimationRegistryEntry {
  id: string;
  type: EffectType;
  target: string;
  isActive: boolean;
  metadata?: Record<string, unknown>; // オプションの追加情報
}

export interface Position {
  x: number;
  y: number;
}
