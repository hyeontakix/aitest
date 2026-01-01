
import type { Action } from './gameState';
import type { GameState, Card } from '../types/game';
import { canBuyCard, getInitialResources, GEM_COLORS } from './utils';

export function decideNextMove(gameState: GameState, aiPlayerIndex: number): Action {
    console.log('decideNextMove called');
    const aiPlayer = gameState.players[aiPlayerIndex];

    // 1. Check if can buy any card that gives points or a noble
    //    Prioritize high points if possible (naive)

    const allVisibleCards = [
        ...gameState.cards.level1,
        ...gameState.cards.level2,
        ...gameState.cards.level3,
        ...aiPlayer.reservedCards
    ];

    // Filter affordable cards
    const affordableCards = allVisibleCards.filter(card => canBuyCard(aiPlayer, card));

    // Sort by Points descending, then by Level descending
    affordableCards.sort((a, b) => {
        if (a.points !== b.points) return b.points - a.points;
        return b.level - a.level;
    });

    if (affordableCards.length > 0) {
        const bestCard = affordableCards[0];
        return { type: 'BUY_CARD', cardId: bestCard.id };
    }

    // 2. If can't buy, try to reserve a good card if we have < 3 reserved
    if (aiPlayer.reservedCards.length < 3) {
        // Find a card we are close to buying or high points
        const targetCard = gameState.cards.level2.concat(gameState.cards.level3).find(c => c.points >= 2);
        if (targetCard && gameState.tokens.gold > 0) {
            return { type: 'RESERVE_CARD', cardId: targetCard.id };
        }
    }

    // 3. Take tokens
    // Better: find a card with minimum missing resources
    let minMissing = 100;
    let chosenTarget: Card | null = null;

    for (const card of allVisibleCards) {
        let missing = 0;
        // @ts-ignore
        const bonuses = aiPlayer.cards.reduce((acc, c) => { acc[c.bonus]++; return acc; }, getInitialResources());

        for (const color of GEM_COLORS) {
            const cost = card.cost[color];
            const has = aiPlayer.tokens[color] + bonuses[color];
            if (cost > has) missing += (cost - has);
        }

        if (missing > 0 && missing < minMissing) {
            minMissing = missing;
            chosenTarget = card;
        }
    }

    const tokensToTake = getInitialResources();
    const bank = gameState.tokens;
    let takeCount = 0;

    if (chosenTarget) {
        // Try to take colors needed for this card
        // @ts-ignore
        const bonuses = aiPlayer.cards.reduce((acc, c) => { acc[c.bonus]++; return acc; }, getInitialResources());

        for (const color of GEM_COLORS) {
            if (takeCount >= 3) break;
            const cost = chosenTarget.cost[color];
            const has = aiPlayer.tokens[color] + bonuses[color];

            if (cost > has && bank[color] > 0) {
                // Need this color
                if (tokensToTake[color] === 0) {
                    tokensToTake[color]++;
                    takeCount++;
                }
            }
        }
    }

    // Fill up to 3 with random available tokens if we didn't pick 3 unique
    if (takeCount < 3) {
        for (const color of GEM_COLORS) {
            if (takeCount >= 3) break;
            // Don't take what we already took
            if (tokensToTake[color] === 0 && bank[color] > 0) {
                tokensToTake[color]++;
                takeCount++;
            }
        }
    }

    return { type: 'TAKE_TOKENS', tokens: tokensToTake };
}
