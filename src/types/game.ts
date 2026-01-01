export type GemColor = 'white' | 'blue' | 'green' | 'red' | 'black' | 'gold';

export interface Resources {
  white: number;
  blue: number;
  green: number;
  red: number;
  black: number;
  gold: number;
}

export interface Card {
  id: number;
  level: 1 | 2 | 3;
  points: number;
  bonus: GemColor; // Gold is not a bonus, but included in GemColor type. Cards only have standard colors.
  cost: Resources;
  image?: string; // For eventually showing the gem art
}

export interface Noble {
  id: number;
  points: number;
  requirements: Resources;
  image?: string;
}

export interface Player {
  id: number; // 0 for Human, 1 for AI
  name: string;
  tokens: Resources;
  cards: Card[]; // Cards owned (bonuses)
  reservedCards: Card[];
  nobles: Noble[];
  points: number;
  isAI: boolean;
}

export type TurnPhase = 'ACTION' | 'DISCARD_TOKENS';

export interface GameState {
  players: Player[];
  tokens: Resources; // Bank
  cards: {
    level1: Card[];
    level2: Card[];
    level3: Card[];
  };
  decks: {
    level1: Card[];
    level2: Card[];
    level3: Card[];
  };
  nobles: Noble[];
  currentPlayerIndex: number;
  turnPhase: TurnPhase;
  winner: number | null; // Player ID
  logs: string[];
}
