import type { Card, GemColor, Noble, Player, Resources } from '../types/game';

export const GEM_COLORS: GemColor[] = ['white', 'blue', 'green', 'red', 'black'];

export function getInitialResources(): Resources {
    return { white: 0, blue: 0, green: 0, red: 0, black: 0, gold: 0 };
}

export function addResources(r1: Resources, r2: Resources): Resources {
    return {
        white: r1.white + r2.white,
        blue: r1.blue + r2.blue,
        green: r1.green + r2.green,
        red: r1.red + r2.red,
        black: r1.black + r2.black,
        gold: r1.gold + r2.gold,
    };
}

export function subtractResources(r1: Resources, r2: Resources): Resources {
    return {
        white: Math.max(0, r1.white - r2.white),
        blue: Math.max(0, r1.blue - r2.blue),
        green: Math.max(0, r1.green - r2.green),
        red: Math.max(0, r1.red - r2.red),
        black: Math.max(0, r1.black - r2.black),
        gold: Math.max(0, r1.gold - r2.gold),
    };
}

export function getTotalTokenCount(resources: Resources): number {
    return (
        resources.white +
        resources.blue +
        resources.green +
        resources.red +
        resources.black +
        resources.gold
    );
}

export function getPlayerBonuses(player: Player): Resources {
    const bonuses = getInitialResources();
    player.cards.forEach((card) => {
        // @ts-ignore
        bonuses[card.bonus]++;
    });
    return bonuses;
}

export function canBuyCard(player: Player, card: Card): boolean {
    const bonuses = getPlayerBonuses(player);
    let goldNeeded = 0;

    for (const color of GEM_COLORS) {
        const cost = card.cost[color];
        const bonus = bonuses[color];
        const tokens = player.tokens[color];

        const remainingCost = Math.max(0, cost - bonus);
        if (tokens < remainingCost) {
            goldNeeded += (remainingCost - tokens);
        }
    }

    return player.tokens.gold >= goldNeeded;
}

export function calculateCost(player: Player, card: Card): Resources {
    const bonuses = getPlayerBonuses(player);
    const costToPay = getInitialResources();
    let goldNeeded = 0;

    for (const color of GEM_COLORS) {
        const cost = card.cost[color];
        const bonus = bonuses[color];
        const tokens = player.tokens[color];

        const remainingCost = Math.max(0, cost - bonus);
        if (tokens >= remainingCost) {
            costToPay[color] = remainingCost;
        } else {
            costToPay[color] = tokens;
            goldNeeded += (remainingCost - tokens);
        }
    }
    costToPay.gold = goldNeeded;
    return costToPay;
}

export function checkNobles(player: Player, nobles: Noble[]): Noble | null {
    // Returns the first noble that visits the player.
    const bonuses = getPlayerBonuses(player);

    for (const noble of nobles) {
        let qualifies = true;
        for (const color of GEM_COLORS) {
            if (bonuses[color] < noble.requirements[color]) {
                qualifies = false;
                break;
            }
        }
        if (qualifies) return noble;
    }
    return null;
}
