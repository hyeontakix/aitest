
import React from 'react';
import type { Resources, GemColor } from '../../types/game';
import GemIcon from '../UI/GemIcon';
import { GEM_COLORS } from '../../logic/utils';

interface Props {
    tokens: Resources;
    onTakeToken: (color: GemColor) => void;
    selectedTokens?: Resources;
}

const TokenBank: React.FC<Props> = ({ tokens, onTakeToken, selectedTokens }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '10px',
            background: 'rgba(255,255,255,0.7)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)'
        }}>
            {GEM_COLORS.map(color => (
                <div key={color} style={{ position: 'relative', cursor: tokens[color] > 0 ? 'pointer' : 'not-allowed' }} onClick={() => tokens[color] > 0 && onTakeToken(color)}>
                    <GemIcon color={color} size="md" count={tokens[color]} />
                    {selectedTokens && selectedTokens[color] > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: -5,
                            right: -5,
                            background: 'lime',
                            borderRadius: '50%',
                            width: 20,
                            height: 20,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                        }}>
                            +{selectedTokens[color]}
                        </div>
                    )}
                </div>
            ))}
            <div style={{ marginTop: 10, cursor: tokens.gold > 0 ? 'pointer' : 'not-allowed' }}>
                <GemIcon color="gold" size="md" count={tokens.gold} onClick={() => { }} />
                {/* Gold logic is separate usually */}
            </div>
        </div>
    );
};

export default TokenBank;
