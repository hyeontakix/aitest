
import { INITIAL_TOKENS_2_PLAYERS, LEVEL_1_CARDS, LEVEL_2_CARDS, LEVEL_3_CARDS, NOBLES } from './constants';
import type { Card, GameState, Player, Resources, TurnPhase } from '../types/game';
import { addResources, calculateCost, canBuyCard, checkNobles, getInitialResources, getTotalTokenCount, subtractResources } from './utils';

// --- Actions ---

export type Action =
    | { type: 'TAKE_TOKENS'; tokens: Resources }
    | { type: 'RESERVE_CARD'; cardId: number } // Reserve from board
    | { type: 'RESERVE_FROM_DECK'; level: 1 | 2 | 3 } // Reserve from deck
    | { type: 'BUY_CARD'; cardId: number } // Buy from board or reserved
    | { type: 'DISCARD_TOKENS'; tokens: Resources } // If > 10 tokens
    | { type: 'NEXT_TURN' }; // AI triggering or explicit pass (usually auto)

// --- Initializer ---

function shuffle<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
}

export function initializeGame(): GameState {
    const l1 = shuffle([...LEVEL_1_CARDS]);
    const l2 = shuffle([...LEVEL_2_CARDS]);
    const l3 = shuffle([...LEVEL_3_CARDS]);

    const visibleCards = {
        level1: l1.splice(0, 4),
        level2: l2.splice(0, 4),
        level3: l3.splice(0, 4),
    };

    const allNobles = shuffle([...NOBLES]);
    const visibleNobles = allNobles.slice(0, 3); // 3 Nobles for 2 players

    const players: Player[] = [
        {
            id: 0,
            name: 'You',
            tokens: getInitialResources(),
            cards: [],
            reservedCards: [],
            nobles: [],
            points: 0,
            isAI: false,
        },
        {
            id: 1,
            name: 'AI',
            tokens: getInitialResources(),
            cards: [],
            reservedCards: [],
            nobles: [],
            points: 0,
            isAI: true,
        },
    ];

    return {
        players,
        tokens: { ...INITIAL_TOKENS_2_PLAYERS },
        cards: visibleCards,
        decks: {
            level1: l1,
            level2: l2,
            level3: l3,
        },
        nobles: visibleNobles,
        currentPlayerIndex: 0,
        turnPhase: 'ACTION',
        winner: null,
        logs: ['Game started! Good luck.'],
    };
}

// --- Reducer ---

export function gameReducer(state: GameState, action: Action): GameState {
    const currentPlayer = state.players[state.currentPlayerIndex];
    const nextPlayerIndex = (state.currentPlayerIndex + 1) % 2;

    switch (action.type) {
        case 'TAKE_TOKENS': {
            // Validate logic handled in UI/AI mostly

            const newPlayerTokens = addResources(currentPlayer.tokens, action.tokens);
            const newBankTokens = subtractResources(state.tokens, action.tokens);

            const newState = {
                ...state,
                players: state.players.map(p => p.id === currentPlayer.id ? { ...p, tokens: newPlayerTokens } : p),
                tokens: newBankTokens,
                logs: [...state.logs, `Player ${currentPlayer.name} took tokens.`],
                turnPhase: 'ACTION' as const
            };

            // Check for > 10 tokens
            if (getTotalTokenCount(newPlayerTokens) > 10) {
                return {
                    ...newState,
                    turnPhase: 'DISCARD_TOKENS',
                    logs: [...newState.logs, `Player ${currentPlayer.name} must discard tokens.`]
                };
            }

            return {
                ...newState,
                currentPlayerIndex: nextPlayerIndex,
            };
        }

        case 'BUY_CARD': {
            // Find card in reserved or board
            let cardToBuy: Card | undefined = currentPlayer.reservedCards.find(c => c.id === action.cardId);
            let fromReserved = true;
            let cardLevel: 'level1' | 'level2' | 'level3' | null = null;

            if (!cardToBuy) {
                fromReserved = false;
                // Check board
                if (state.cards.level1.find(c => c.id === action.cardId)) { cardToBuy = state.cards.level1.find(c => c.id === action.cardId); cardLevel = 'level1'; }
                else if (state.cards.level2.find(c => c.id === action.cardId)) { cardToBuy = state.cards.level2.find(c => c.id === action.cardId); cardLevel = 'level2'; }
                else if (state.cards.level3.find(c => c.id === action.cardId)) { cardToBuy = state.cards.level3.find(c => c.id === action.cardId); cardLevel = 'level3'; }
            }

            if (!cardToBuy) return state; // Error

            // Check cost
            if (!canBuyCard(currentPlayer, cardToBuy)) return state; // Error

            // Pay cost
            const costToPay = calculateCost(currentPlayer, cardToBuy);
            const newPlayerTokens = subtractResources(currentPlayer.tokens, costToPay);
            const newBankTokens = addResources(state.tokens, costToPay);

            // Update Player
            const updatedPlayer: Player = {
                ...currentPlayer,
                tokens: newPlayerTokens,
                cards: [...currentPlayer.cards, cardToBuy],
                points: currentPlayer.points + cardToBuy.points,
                reservedCards: fromReserved
                    ? currentPlayer.reservedCards.filter(c => c.id !== action.cardId)
                    : currentPlayer.reservedCards
            };

            // Check for Nobles
            const nobleReceived = checkNobles(updatedPlayer, state.nobles);
            let updatedNobles = state.nobles;
            if (nobleReceived) {
                updatedPlayer.nobles.push(nobleReceived);
                updatedPlayer.points += nobleReceived.points;
                updatedNobles = state.nobles.filter(n => n.id !== nobleReceived.id);
            }

            // Replenish Board if needed
            const updatedCards = { ...state.cards };
            const updatedDecks = { ...state.decks };

            if (!fromReserved && cardLevel) {
                const newCard = updatedDecks[cardLevel].length > 0 ? updatedDecks[cardLevel].pop() : undefined; // Simplified pop logic
                if (newCard) {
                    // Replace the specific card index
                    const idx = updatedCards[cardLevel].findIndex(c => c.id === action.cardId);
                    if (idx !== -1) updatedCards[cardLevel][idx] = newCard;
                } else {
                    // Just remove
                    updatedCards[cardLevel] = updatedCards[cardLevel].filter(c => c.id !== action.cardId);
                }
            }

            // Check Winner
            let winner = state.winner;
            if (updatedPlayer.points >= 15) {
                // We'll set winner here for simplicity.
                winner = updatedPlayer.id;
            }

            return {
                ...state,
                players: state.players.map(p => p.id === currentPlayer.id ? updatedPlayer : p),
                tokens: newBankTokens,
                cards: updatedCards,
                decks: updatedDecks,
                nobles: updatedNobles,
                winner,
                logs: [...state.logs, `Player ${currentPlayer.name} bought a card.`],
                currentPlayerIndex: nextPlayerIndex,
            };
        }

        case 'RESERVE_CARD': {
            if (currentPlayer.reservedCards.length >= 3) return state;

            let cardToReserve: Card | undefined;
            let cardLevel: 'level1' | 'level2' | 'level3' | null = null;

            if (state.cards.level1.find(c => c.id === action.cardId)) { cardToReserve = state.cards.level1.find(c => c.id === action.cardId); cardLevel = 'level1'; }
            else if (state.cards.level2.find(c => c.id === action.cardId)) { cardToReserve = state.cards.level2.find(c => c.id === action.cardId); cardLevel = 'level2'; }
            else if (state.cards.level3.find(c => c.id === action.cardId)) { cardToReserve = state.cards.level3.find(c => c.id === action.cardId); cardLevel = 'level3'; }

            if (!cardToReserve || !cardLevel) return state;

            // Gold token logic
            let newBankTokens = { ...state.tokens };
            let newPlayerTokens = { ...currentPlayer.tokens };

            if (state.tokens.gold > 0) {
                newBankTokens.gold--;
                newPlayerTokens.gold++;
            }

            // Update Player
            const updatedPlayer: Player = {
                ...currentPlayer,
                tokens: newPlayerTokens,
                reservedCards: [...currentPlayer.reservedCards, cardToReserve]
            };

            // Replenish Board
            const updatedCards = { ...state.cards };
            const updatedDecks = { ...state.decks };

            const newCard = updatedDecks[cardLevel].length > 0 ? updatedDecks[cardLevel].pop() : undefined;
            if (newCard) {
                const idx = updatedCards[cardLevel].findIndex(c => c.id === action.cardId);
                if (idx !== -1) updatedCards[cardLevel][idx] = newCard;
            } else {
                updatedCards[cardLevel] = updatedCards[cardLevel].filter(c => c.id !== action.cardId);
            }

            // Check for discard
            let nextPhase: TurnPhase = 'ACTION';
            if (getTotalTokenCount(newPlayerTokens) > 10) {
                nextPhase = 'DISCARD_TOKENS';
            }

            return {
                ...state,
                players: state.players.map(p => p.id === currentPlayer.id ? updatedPlayer : p),
                tokens: newBankTokens,
                cards: updatedCards,
                decks: updatedDecks,
                logs: [...state.logs, `Player ${currentPlayer.name} reserved a card.`],
                currentPlayerIndex: nextPhase === 'DISCARD_TOKENS' ? state.currentPlayerIndex : nextPlayerIndex,
                turnPhase: nextPhase
            };
        }

        case 'DISCARD_TOKENS': {
            const newPlayerTokens = subtractResources(currentPlayer.tokens, action.tokens);
            const newBankTokens = addResources(state.tokens, action.tokens);

            if (getTotalTokenCount(newPlayerTokens) > 10) {
                // Still need to discard
                return {
                    ...state,
                    players: state.players.map(p => p.id === currentPlayer.id ? { ...p, tokens: newPlayerTokens } : p),
                    tokens: newBankTokens,
                    logs: [...state.logs, `Player ${currentPlayer.name} discarded tokens but still has too many.`],
                };
            }

            return {
                ...state,
                players: state.players.map(p => p.id === currentPlayer.id ? { ...p, tokens: newPlayerTokens } : p),
                tokens: newBankTokens,
                turnPhase: 'ACTION', // Reset phase
                currentPlayerIndex: nextPlayerIndex,
                logs: [...state.logs, `Player ${currentPlayer.name} finished discarding.`],
            };
        }

        default:
            return state;
    }
}
