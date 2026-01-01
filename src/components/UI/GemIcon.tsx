import React from 'react';
import type { GemColor } from '../../types/game';

interface Props {
    color: GemColor;
    size?: 'sm' | 'md' | 'lg';
    count?: number;
    className?: string;
    onClick?: () => void;
}

// Adjust for actual visual distinction
const visualColors: Record<GemColor, string> = {
    white: '#fcfcfc',
    blue: '#2980b9',
    green: '#27ae60',
    red: '#e74c3c',
    black: '#34495e',
    gold: '#f1c40f',
};

const GemIcon: React.FC<Props> = ({ color, size = 'md', count, className = '', onClick }) => {
    const styles = {
        backgroundColor: visualColors[color],
        border: `2px solid ${color === 'white' ? '#bdc3c7' : 'rgba(0,0,0,0.1)'}`,
        color: color === 'white' || color === 'gold' ? '#333' : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        fontWeight: 'bold',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    };

    return (
        <div
            style={{ ...styles, width: size === 'sm' ? 24 : size === 'md' ? 40 : 64, height: size === 'sm' ? 24 : size === 'md' ? 40 : 64 }}
            className={`gem-icon ${className}`}
            onClick={onClick}
        >
            {count !== undefined && count}
        </div>
    );
};

export default GemIcon;
