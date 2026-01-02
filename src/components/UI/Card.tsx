
import React from 'react';
import type { Card as CardType, GemColor } from '../../types/game';
import GemIcon from './GemIcon';
import './Card.css';

interface Props {
    card: CardType;
    onClick?: (card: CardType) => void;
    onReserve?: (card: CardType) => void;
    disabled?: boolean;
    canBuy?: boolean;
}

const Card: React.FC<Props> = ({ card, onClick, onReserve, disabled, canBuy }) => {
    const handleClick = (e: React.MouseEvent) => {
        if (disabled) return;

        if (e.shiftKey && onReserve) {
            e.preventDefault();
            onReserve(card);
        } else {
            onClick?.(card);
        }
    };

    return (
        <div
            className={`game-card level-${card.level} ${canBuy ? 'can-buy' : ''} ${disabled ? 'disabled' : ''}`}
            onClick={handleClick} // Keep fallback for now, or could remove if buttons suffice (User might still expect click to buy)
        >
            <div className="card-header">
                <div className="card-points">{card.points > 0 ? card.points : ''}</div>
                <div className="card-bonus">
                    <GemIcon color={card.bonus} size="sm" />
                </div>
            </div>
            <div className="card-content">
                {/* Placeholder for image */}
                <div className="card-image-placeholder"></div>
            </div>
            <div className="card-cost">
                {Object.entries(card.cost).map(([color, amount]) => {
                    if (amount === 0) return null;
                    return (
                        <div key={color} className="cost-item">
                            <div className="cost-bubble" style={{ backgroundColor: getVarColor(color as GemColor) }}>
                                {amount}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Action Overlay */}
            {!disabled && (
                <div className="card-actions-overlay">
                    {canBuy && (
                        <button
                            className="card-action-btn buy-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick?.(card);
                            }}
                        >
                            Buy
                        </button>
                    )}
                    {onReserve && (
                        <button
                            className="card-action-btn reserve-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                onReserve(card);
                            }}
                        >
                            Reserve
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

// Helper for CSS vars mapping logic purely for inline fallback or quick util
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

export default Card;
