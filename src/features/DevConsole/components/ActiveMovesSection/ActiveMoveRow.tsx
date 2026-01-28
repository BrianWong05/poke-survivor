import React from 'react';
import { styles } from '../../styles';
import { type ActiveWeapon } from '../../types';

interface ActiveMoveRowProps {
    weapon: ActiveWeapon;
    onRemove: (id: string) => void;
    onSetLevel: (id: string, level: number) => void;
}

export const ActiveMoveRow: React.FC<ActiveMoveRowProps> = ({ weapon, onRemove, onSetLevel }) => {
    return (
        <div style={styles.activeRow}>
            <div style={{flex: 1}}>
                <span style={{fontWeight: 'bold'}}>{weapon.name}</span>
            </div>
            <div style={styles.levelControls}>
                <button onClick={() => onSetLevel(weapon.id, weapon.level - 1)} style={styles.levelBtn}>-</button>
                <span style={styles.levelDisplay}>Lvl {weapon.level}</span>
                <button 
                    onClick={() => onSetLevel(weapon.id, weapon.level + 1)} 
                    style={{...styles.levelBtn, opacity: weapon.level >= 8 ? 0.5 : 1, cursor: weapon.level >= 8 ? 'not-allowed' : 'pointer'}}
                    disabled={weapon.level >= 8}
                >+</button>
            </div>
            <button onClick={() => onRemove(weapon.id)} style={styles.removeBtn}>×</button>
        </div>
    );
};
