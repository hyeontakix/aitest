
import React from 'react';
import type { Player, Resources, GemColor } from '../../types/game';
import GemIcon from '../UI/GemIcon';
import { GEM_COLORS } from '../../logic/utils';
import Card from '../UI/Card';

interface Props {
    player: Player;
    isActive: boolean;
}

const PlayerArea: React.FC<Props> = ({ player, isActive }) => {
    // Aggregate card bonuses for display
    const bonuses: Resources = { white: 0, blue: 0, green: 0, red: 0, black: 0, gold: 0 };
    player.cards.forEach(c => {
        // @ts-ignore
        if (bonuses[c.bonus] !== undefined) bonuses[c.bonus]++;
    });

    return (
        <div style={{
            padding: 15,
            borderRadius: 12,
            background: isActive ? 'linear-gradient(to right, #fdfbfb, #ebedee)' : '#fff',
            border: isActive ? '2px solid #3498db' : '1px solid #ccc',
            opacity: isActive ? 1 : 0.8,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            boxShadow: isActive ? '0 0 15px rgba(52, 152, 219, 0.3)' : 'none',
            transition: 'all 0.3s ease'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>{player.name} {player.isAI ? '(Bot)' : ''}</h3>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f1c40f' }}>
                    {player.points} <span style={{ fontSize: '0.9rem', color: '#777' }}>VP</span>
                </div>
            </div>

            {/* Resources Summary */}
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {GEM_COLORS.map(color => (
                    <div key={color} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 30 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#555' }}>{bonuses[color]}</div>
                        {/* Card Rectangle */}
                        <div style={{ width: 20, height: 26, background: getCardColor(color), borderRadius: 3, marginBottom: 2 }}></div>

                        {/* Token Circle */}
                        <GemIcon color={color} size="sm" count={player.tokens[color]} />
                    </div>
                ))}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 30, marginLeft: 5 }}>
                    <div style={{ height: 18 }}></div>
                    {/* Gold */}
                    <div style={{ height: 26 }}></div>
                    <GemIcon color="gold" size="sm" count={player.tokens.gold} />
                </div>
            </div>

            {/* Reserved Cards */}
            {player.reservedCards.length > 0 && (
                <div style={{ marginTop: 5 }}>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Reserved ({player.reservedCards.length})</div>
                    <div style={{ display: 'flex', gap: 5 }}>
                        {player.reservedCards.map(c => (
                            <div key={c.id} style={{ transform: 'scale(0.6)', transformOrigin: 'top left', width: 60, height: 80 }}>
                                <Card card={c} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Nobles */}
            {player.nobles.length > 0 && (
                <div style={{ marginTop: 5 }}>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Nobles</div>
                    <div style={{ display: 'flex', gap: 5 }}>
                        {player.nobles.map(n => (
                            <div key={n.id} style={{ width: 40, height: 40, background: '#8e44ad', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
                                {n.points}
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

function getCardColor(color: GemColor) {
    switch (color) {
        case 'white': return '#fcfcfc';
        case 'blue': return '#2980b9';
        case 'green': return '#27ae60';
        case 'red': return '#e74c3c';
        case 'black': return '#34495e';
        default: return '#ccc';
    }
}

export default PlayerArea;
