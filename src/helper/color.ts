// Color configuration table for easy adjustments
export const colorTable = {
  // Card Colors (by number)
  cardColors: {
    0: 'bg-gray-400', // Neutral
    1: 'bg-red-600', // Red (lighter than before)
    2: 'bg-yellow-500', // Yellow (lighter than before)
    3: 'bg-blue-500', // Blue
    4: 'bg-green-500', // Green (lighter than before)
    5: 'bg-purple-600', // Purple (lighter than before)
  },

  // Card Color Hex Values (for inline styles)
  cardColorHex: {
    0: { normal: '#9ca3af', dark: '#6b7280' },
    1: { normal: '#dc2626', dark: '#991b1b' },
    2: { normal: '#eab308', dark: '#a16207' },
    3: { normal: '#3b82f6', dark: '#1e40af' },
    4: { normal: '#22c55e', dark: '#15803d' },
    5: { normal: '#9333ea', dark: '#6b21a8' },
  },

  // Symbol Colors
  symbols: {
    life: 'text-red-400',
    mana: 'text-blue-400',
    cp: 'text-pink-400',
  },
};

// Theme colors for first/second player
export const themeColors = {
  // 先行プレイヤーのテーマ（青系）
  first: {
    primary: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-500',
    secondary: 'bg-blue-800',
    accent: 'bg-cyan-500',
    border: 'border-blue-500',
    borderAccent: 'border-cyan-400',
    text: {
      primary: 'text-white',
      secondary: 'text-blue-200',
      accent: 'text-cyan-300',
    },
    ui: {
      background: 'bg-slate-800',
      fieldBackground: 'bg-blue-900/30',
      playerInfoBackground: 'bg-blue-900/50',
      border: 'border-blue-700',
      borderDashed: 'border-blue-600',
      cardBackground: 'bg-blue-800/60',
    },
  },
  // 後攻プレイヤーのテーマ（オレンジ系）
  second: {
    primary: 'bg-orange-600',
    primaryHover: 'hover:bg-orange-500',
    secondary: 'bg-orange-800',
    accent: 'bg-orange-500',
    border: 'border-orange-500',
    borderAccent: 'border-orange-400',
    text: {
      primary: 'text-white',
      secondary: 'text-orange-200',
      accent: 'text-orange-300',
    },
    ui: {
      background: 'bg-stone-800',
      fieldBackground: 'bg-orange-900/30',
      playerInfoBackground: 'bg-orange-900/50',
      border: 'border-orange-700',
      borderDashed: 'border-orange-600',
      cardBackground: 'bg-orange-800/60',
    },
  },
} as const;

export type PlayerTheme = keyof typeof themeColors;

// Get theme colors for a player (first or second)
export const getTheme = (theme: PlayerTheme) => themeColors[theme];

// Get specific theme UI color
export const getThemeUIColor = (theme: PlayerTheme, key: keyof typeof themeColors.first.ui) => {
  return themeColors[theme].ui[key];
};

// Default UI colors (for backwards compatibility)
export const defaultUIColors = {
  background: 'bg-slate-700',
  fieldBackground: 'bg-slate-600/40',
  playerInfoBackground: 'bg-slate-700/90',
  border: 'border-slate-600',
  borderDashed: 'border-slate-500',
  text: {
    primary: 'text-white',
    secondary: 'text-slate-300',
  },
  cardBackground: 'bg-gray-600',
};

// Color mapping function for card colors
export const getColorCode = (color: number) => {
  return colorTable.cardColors[color as keyof typeof colorTable.cardColors] || 'bg-gray-400';
};

// Helper to get UI colors
export const getUIColor = (colorPath: string): string | undefined => {
  // Split the path (e.g., "ui.background" -> ["ui", "background"])
  const parts = colorPath.split('.');

  // Navigate through the colorTable object
  let result: unknown = colorTable;
  for (const part of parts) {
    if (
      result &&
      typeof result === 'object' &&
      Object.prototype.hasOwnProperty.call(result, part)
    ) {
      result = (result as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return typeof result === 'string' ? result : undefined;
};

export const getCostColor = (delta: number) => {
  if (delta === 0) return 'text-white';
  if (delta > 0) return 'text-red-500';
  if (delta < 0) return 'text-blue-500';
};
