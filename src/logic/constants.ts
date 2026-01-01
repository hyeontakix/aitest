import type { Card, Noble } from '../types/game';

// Simplified set for MVP - can be expanded to full standard set later
export const LEVEL_1_CARDS: Card[] = [
    { id: 101, level: 1, points: 0, bonus: 'black', cost: { white: 1, blue: 1, green: 1, red: 1, black: 0, gold: 0 } },
    { id: 102, level: 1, points: 0, bonus: 'blue', cost: { white: 1, blue: 0, green: 1, red: 1, black: 1, gold: 0 } },
    { id: 103, level: 1, points: 0, bonus: 'white', cost: { white: 0, blue: 1, green: 1, red: 1, black: 1, gold: 0 } },
    { id: 104, level: 1, points: 0, bonus: 'green', cost: { white: 1, blue: 1, green: 0, red: 1, black: 1, gold: 0 } },
    { id: 105, level: 1, points: 0, bonus: 'red', cost: { white: 1, blue: 1, green: 1, red: 0, black: 1, gold: 0 } },
    { id: 106, level: 1, points: 0, bonus: 'black', cost: { white: 0, blue: 2, green: 1, red: 0, black: 0, gold: 0 } },
    { id: 107, level: 1, points: 0, bonus: 'blue', cost: { white: 0, blue: 0, green: 0, red: 2, black: 1, gold: 0 } },
    { id: 108, level: 1, points: 0, bonus: 'white', cost: { white: 0, blue: 0, green: 2, red: 1, black: 0, gold: 0 } },
    { id: 109, level: 1, points: 1, bonus: 'green', cost: { white: 0, blue: 0, green: 0, red: 0, black: 4, gold: 0 } },
    { id: 110, level: 1, points: 1, bonus: 'red', cost: { white: 4, blue: 0, green: 0, red: 0, black: 0, gold: 0 } },
    // Adding more basic cards 
    { id: 111, level: 1, points: 0, bonus: 'black', cost: { white: 0, blue: 0, green: 1, red: 2, black: 0, gold: 0 } },
    { id: 112, level: 1, points: 0, bonus: 'blue', cost: { white: 0, blue: 0, green: 0, red: 0, black: 3, gold: 0 } },
    { id: 113, level: 1, points: 0, bonus: 'white', cost: { white: 0, blue: 2, green: 0, red: 0, black: 2, gold: 0 } },
    { id: 114, level: 1, points: 0, bonus: 'green', cost: { white: 2, blue: 1, green: 0, red: 0, black: 0, gold: 0 } },
    { id: 115, level: 1, points: 0, bonus: 'red', cost: { white: 2, blue: 0, green: 2, red: 0, black: 0, gold: 0 } },
];

export const LEVEL_2_CARDS: Card[] = [
    { id: 201, level: 2, points: 1, bonus: 'blue', cost: { white: 0, blue: 2, green: 2, red: 3, black: 0, gold: 0 } },
    { id: 202, level: 2, points: 1, bonus: 'green', cost: { white: 2, blue: 3, green: 0, red: 0, black: 2, gold: 0 } },
    { id: 203, level: 2, points: 2, bonus: 'white', cost: { white: 0, blue: 0, green: 1, red: 4, black: 2, gold: 0 } },
    { id: 204, level: 2, points: 2, bonus: 'black', cost: { white: 0, blue: 5, green: 0, red: 0, black: 0, gold: 0 } },
    { id: 205, level: 2, points: 2, bonus: 'red', cost: { white: 0, blue: 0, green: 0, red: 0, black: 5, gold: 0 } },
    { id: 206, level: 2, points: 3, bonus: 'blue', cost: { white: 6, blue: 0, green: 0, red: 0, black: 0, gold: 0 } },
    // More to ensure playability
    { id: 207, level: 2, points: 1, bonus: 'green', cost: { white: 2, blue: 0, green: 2, red: 3, black: 0, gold: 0 } },
    { id: 208, level: 2, points: 2, bonus: 'black', cost: { white: 0, blue: 0, green: 5, red: 3, black: 0, gold: 0 } },
    { id: 209, level: 2, points: 2, bonus: 'red', cost: { white: 3, blue: 0, green: 0, red: 0, black: 5, gold: 0 } },
    { id: 210, level: 2, points: 1, bonus: 'white', cost: { white: 0, blue: 3, green: 0, red: 2, black: 2, gold: 0 } },

];

export const LEVEL_3_CARDS: Card[] = [
    { id: 301, level: 3, points: 3, bonus: 'blue', cost: { white: 3, blue: 0, green: 3, red: 3, black: 5, gold: 0 } },
    { id: 302, level: 3, points: 4, bonus: 'green', cost: { white: 0, blue: 7, green: 0, red: 0, black: 0, gold: 0 } },
    { id: 303, level: 3, points: 4, bonus: 'red', cost: { white: 0, blue: 0, green: 7, red: 0, black: 0, gold: 0 } },
    { id: 304, level: 3, points: 5, bonus: 'black', cost: { white: 3, blue: 0, green: 0, red: 7, black: 3, gold: 0 } },
    { id: 305, level: 3, points: 3, bonus: 'white', cost: { white: 0, blue: 3, green: 3, red: 5, black: 3, gold: 0 } },
    { id: 306, level: 3, points: 4, bonus: 'white', cost: { white: 0, blue: 0, green: 0, red: 0, black: 7, gold: 0 } },
];

export const NOBLES: Noble[] = [
    { id: 1, points: 3, requirements: { white: 3, blue: 3, green: 0, red: 0, black: 3, gold: 0 } },
    { id: 2, points: 3, requirements: { white: 0, blue: 3, green: 3, red: 3, black: 0, gold: 0 } },
    { id: 3, points: 3, requirements: { white: 4, blue: 4, green: 0, red: 0, black: 0, gold: 0 } },
    { id: 4, points: 3, requirements: { white: 0, blue: 0, green: 4, red: 4, black: 0, gold: 0 } },
    { id: 5, points: 3, requirements: { white: 3, blue: 0, green: 0, red: 3, black: 3, gold: 0 } },
];

import type { Resources } from '../types/game';

export const INITIAL_TOKENS_2_PLAYERS: Resources = {
    white: 4,
    blue: 4,
    green: 4,
    red: 4,
    black: 4,
    gold: 5,
};
