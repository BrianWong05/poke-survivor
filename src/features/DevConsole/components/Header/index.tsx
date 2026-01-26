import React from 'react';
import { styles } from '../../styles';

interface HeaderProps {
    isPaused: boolean;
    onTogglePause: () => void;
    onClose: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isPaused, onTogglePause, onClose }) => {
    return (
        <div style={styles.header}>
            <div style={styles.titleGroup}>
                <h2>Dev Console</h2>
                <button 
                    onClick={onTogglePause} 
                    style={{ ...styles.pauseBtn, color: isPaused ? '#f1c40f' : '#2ecc71' }}
                >
                    {isPaused ? '▶ Resume Game' : '⏸ Pause Game'}
                </button>
            </div>
            <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>
    );
};
