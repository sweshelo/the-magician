// Deck type definition
export type DeckData = {
  title: string;
  cards: string[];
};

export const LocalStorageHelper = {
  playerId: (): string => {
    // Check if code is running in a browser environment
    if (typeof window === 'undefined') {
      return '';
    }

    const id = window.localStorage.getItem('playerId');
    if (id !== null) {
      return id;
    } else {
      // Generate UUID safely
      const newId = crypto.randomUUID();
      window.localStorage.setItem('playerId', newId);
      return newId;
    }
  },

  // Get all saved decks
  getAllDecks: (): DeckData[] => {
    if (typeof window === 'undefined') {
      return [];
    }

    const decksStr = window.localStorage.getItem('decks');
    if (decksStr) {
      try {
        return JSON.parse(decksStr);
      } catch (e) {
        console.error('Error parsing decks from localStorage', e);
        return [];
      }
    }
    return [];
  },

  // Save a deck (new or overwrite)
  saveDeck: (title: string, cards: string[]): void => {
    if (typeof window === 'undefined') {
      return;
    }

    const decks = LocalStorageHelper.getAllDecks();
    const existingDeckIndex = decks.findIndex(deck => deck.title === title);

    if (existingDeckIndex >= 0) {
      // Update existing deck
      decks[existingDeckIndex] = { title, cards };
    } else {
      // Add new deck
      decks.push({ title, cards });
    }

    window.localStorage.setItem('decks', JSON.stringify(decks));
  },

  // Get a deck by title
  getDeckByTitle: (title: string): DeckData | null => {
    if (typeof window === 'undefined') {
      return null;
    }

    const decks = LocalStorageHelper.getAllDecks();
    const deck = decks.find(d => d.title === title);
    return deck || null;
  },

  // Delete a deck
  deleteDeck: (title: string): void => {
    if (typeof window === 'undefined') {
      return;
    }

    const decks = LocalStorageHelper.getAllDecks();
    const filteredDecks = decks.filter(deck => deck.title !== title);
    window.localStorage.setItem('decks', JSON.stringify(filteredDecks));
  },
};
