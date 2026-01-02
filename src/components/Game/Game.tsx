
import React, { useReducer, useEffect, useState } from 'react';
import { initializeGame, gameReducer } from '../../logic/gameState';
import { decideNextMove } from '../../logic/ai';
import { canBuyCard } from '../../logic/utils';
import Card from '../UI/Card';
import TokenBank from '../Board/TokenBank';
import PlayerArea from '../Player/PlayerArea';
import type { Card as CardType, Resources, GemColor } from '../../types/game';
import './Game.css';

const Game: React.FC = () => {
    const [gameState, dispatch] = useReducer(gameReducer, undefined, initializeGame);
    const [selectedTokens, setSelectedTokens] = useState<Resources>({ white: 0, blue: 0, green: 0, red: 0, black: 0, gold: 0 });
    const [lastAction, setLastAction] = useState<string | null>(null);

    const humanPlayer = gameState.players[0];
    const aiPlayer = gameState.players[1];
    const isHumanTurn = gameState.currentPlayerIndex === 0;

    const aiThinkingRef = React.useRef(false);

    // AI Turn Logic
    useEffect(() => {
        // console.log('AI Effect Triggered:', { idx: gameState.currentPlayerIndex, winner: gameState.winner });
        if (gameState.currentPlayerIndex === 1 && !gameState.winner) {
            if (aiThinkingRef.current) return;

            aiThinkingRef.current = true;
            console.log('AI Scheduling Move...');
            const timer = setTimeout(() => {
                console.log('AI Executing Move...');
                try {
                    const action = decideNextMove(gameState, 1);
                    console.log('AI Action Decided:', action);
                    dispatch(action);
                } catch (e) {
                    console.error('AI Logic Error:', e);
                } finally {
                    aiThinkingRef.current = false;
                }
            }, 1500); // Delay for realism
            return () => {
                clearTimeout(timer);
                aiThinkingRef.current = false;
            };
        }
    }, [gameState.currentPlayerIndex, gameState.winner, gameState.turnPhase]);

    // Toast Logic: Watch logs
    useEffect(() => {
        if (gameState.logs.length > 0) {
            const lastLog = gameState.logs[gameState.logs.length - 1];
            // Only show toast for meaningful actions (skip "Game started" if desired, or show all)
            setLastAction(lastLog);
            const timer = setTimeout(() => setLastAction(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [gameState.logs]);

    // Token Selection Logic
    const handleTakeToken = (color: GemColor) => {
        if (!isHumanTurn || gameState.winner) return;
        if (color === 'gold') return; // Cannot take gold directly usually (only reserve)

        const currentCount = selectedTokens[color];
        const totalSelected = Object.values(selectedTokens).reduce((a, b) => a + b, 0);

        // Rule: Max 3 tokens total
        if (totalSelected >= 3) return;

        // Rule: If we already have 2 of THIS color, cannot take more (limit 2 same)
        if (currentCount >= 2) return;

        // Rule: If we are trying to take a 2nd token of THIS color...
        if (currentCount === 1) {
            // Must be at least 4 in the bank to take 2
            if (gameState.tokens[color] < 4) return;

            // Cannot mix "2 same" with any other tokens. 
            // So if we already have others (totalSelected > 1), we can't do this.
            // totalSelected is currently including the 1 of this color.
            // If totalSelected == 1, it means we only have this 1 token, so taking another is fine (if bank allows).
            // If totalSelected > 1, it means we have this token + others. So we can't take a 2nd of this one.
            if (totalSelected > 1) return;

            // Allow selection
            setSelectedTokens(prev => ({ ...prev, [color]: prev[color] + 1 }));
            return;
        }

        // Rule: If we are trying to take a 1st token of THIS color...
        if (currentCount === 0) {
            // Check if we already have a "2 same" stack selected somewhere else?
            const hasTwoSame = Object.values(selectedTokens).some(v => v >= 2);
            if (hasTwoSame) return; // Cannot add different token if we have a double stack

            // Otherwise, we are just adding a different token.
            // We already checked totalSelected < 3 at the top.
            setSelectedTokens(prev => ({ ...prev, [color]: prev[color] + 1 }));
            return;
        }
    };

    const handleConfirmTokens = () => {
        // If user wants to stop at 2 different tokens? (Allowed? Usually must take 3 if possible)
        // Implementation: allow dispatching current selection
        dispatch({ type: 'TAKE_TOKENS', tokens: selectedTokens });
        setSelectedTokens(initialResources());
    };

    const handleClearTokens = () => {
        setSelectedTokens(initialResources());
    };

    const handleBuyCard = (card: CardType) => {
        if (!isHumanTurn || gameState.winner) return;
        if (canBuyCard(humanPlayer, card)) {
            dispatch({ type: 'BUY_CARD', cardId: card.id });
        }
    };

    const handleReserveCard = (card: CardType) => {
        if (!isHumanTurn || gameState.winner) return;
        // Check validity
        if (humanPlayer.reservedCards.length >= 3) {
            alert("You cannot reserve more than 3 cards!");
            return;
        }
        dispatch({ type: 'RESERVE_CARD', cardId: card.id });
    };

    return (
        <div className="game-container">
            {lastAction && <div className="action-toast">{lastAction}</div>}
            {gameState.winner !== null && (
                <div className="victory-overlay">
                    <div className="victory-modal">
                        <h1>{gameState.winner === 0 ? 'VICTORY!' : 'DEFEAT'}</h1>
                        <button onClick={() => window.location.reload()}>Play Again</button>
                    </div>
                </div>
            )}

            {/* Opponent Area */}
            <div className="opponent-area">
                <div style={{ position: 'absolute', top: 10, color: 'white', fontWeight: 'bold' }}>
                    Turn: {gameState.currentPlayerIndex === 0 ? 'You' : 'AI'}
                </div>
                <PlayerArea player={aiPlayer} isActive={!isHumanTurn} />
            </div>

            {/* Main Board */}
            <div className="board">
                <div className="nobles-row">
                    {gameState.nobles.map(noble => (
                        <div key={noble.id} className="noble-tile">
                            <div className="noble-points">{noble.points}</div>
                            <div className="noble-reqs">
                                {Object.entries(noble.requirements).map(([color, count]) => count > 0 && (
                                    <div key={color} className="noble-req-item" style={{ backgroundColor: getVarColor(color as GemColor) }}>{count}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cards-grid">
                    {/* Level 3 */}
                    <div className="card-row">
                        <div className="deck-placeholder level-3-deck">Level 3 ({gameState.decks.level3.length})</div>
                        {gameState.cards.level3.map(card => (
                            <Card
                                key={card.id}
                                card={card}
                                onClick={(c) => handleBuyCard(c)}
                                onReserve={(c) => handleReserveCard(c)}
                                canBuy={isHumanTurn && canBuyCard(humanPlayer, card)}
                            />
                        ))}
                    </div>

                    {/* Level 2 */}
                    <div className="card-row">
                        <div className="deck-placeholder level-2-deck">Level 2 ({gameState.decks.level2.length})</div>
                        {gameState.cards.level2.map(card => (
                            <Card
                                key={card.id}
                                card={card}
                                onClick={(c) => handleBuyCard(c)}
                                onReserve={(c) => handleReserveCard(c)}
                                canBuy={isHumanTurn && canBuyCard(humanPlayer, card)}
                            />
                        ))}
                    </div>

                    {/* Level 1 */}
                    <div className="card-row">
                        <div className="deck-placeholder level-1-deck">Level 1 ({gameState.decks.level1.length})</div>
                        {gameState.cards.level1.map(card => (
                            <Card
                                key={card.id}
                                card={card}
                                onClick={(c) => handleBuyCard(c)}
                                onReserve={(c) => handleReserveCard(c)}
                                canBuy={isHumanTurn && canBuyCard(humanPlayer, card)}
                            />
                        ))}
                    </div>
                </div>

                <div className="token-area">
                    <TokenBank tokens={gameState.tokens} onTakeToken={handleTakeToken} selectedTokens={selectedTokens} />

                    <div className="action-buttons">
                        {Object.values(selectedTokens).some(v => v > 0) && (
                            <>
                                <button onClick={handleConfirmTokens}>Confirm</button>
                                <button onClick={handleClearTokens}>Clear</button>
                            </>
                        )}
                    </div>

                    <div className="game-log">
                        {gameState.logs.slice(-5).map((log, i) => <div key={i}>{log}</div>)}
                    </div>
                </div>
            </div>

            {/* Player Area */}
            <div className="player-area-wrapper">
                <PlayerArea player={humanPlayer} isActive={isHumanTurn} />
                {/* Reserve capability controls can go here */}
            </div>

        </div>
    );
};

function initialResources(): Resources {
    return { white: 0, blue: 0, green: 0, red: 0, black: 0, gold: 0 };
}

function getVarColor(color: GemColor) {
    switch (color) {
        case 'white': return '#fcfcfc';
        case 'blue': return '#2980b9';
        case 'green': return '#27ae60';
        case 'red': return '#e74c3c';
        case 'black': return '#34495e';
        case 'gold': return '#f1c40f';
    }
}


export default Game;
