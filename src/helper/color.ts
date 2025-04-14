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

  // Game UI Colors
  ui: {
    background: 'bg-slate-700', // Lighter game background (was bg-slate-900)
    fieldBackground: 'bg-slate-600/40', // Lighter field background (was bg-slate-800/40)
    playerInfoBackground: 'bg-slate-700/70', // Lighter player info background (was bg-slate-800/70)
    border: 'border-slate-600', // Border color
    borderDashed: 'border-slate-500', // Dashed border color (was border-slate-600)
    text: {
      primary: 'text-white',
      secondary: 'text-slate-300', // Lighter secondary text (was text-slate-400)
    },
    opponentCardBackground: 'bg-gray-600',
  },

  // Symbol Colors
  symbols: {
    life: 'text-red-400',
    mana: 'text-blue-400',
    cp: 'text-yellow-400',
  },
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
