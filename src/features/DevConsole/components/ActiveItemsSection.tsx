import React from 'react';
import { Section } from './Shared/Section';
import { styles } from '../styles';
import { type ActiveItem } from '../types';

interface ActiveItemsSectionProps {
    activeItems: ActiveItem[];
}

export const ActiveItemsSection: React.FC<ActiveItemsSectionProps> = ({ 
    activeItems 
}) => {
    return (
        <Section title="Active Items">
            {activeItems.length === 0 ? (
                <div style={styles.hint}>No items acquired.</div>
            ) : (
                activeItems.map((item) => (
                    <div key={item.id} style={styles.activeRow}>
                        <div style={{ flex: 1 }}>
                            <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                        </div>
                        <div style={styles.levelControls}>
                            <span style={styles.levelDisplay}>Lvl {item.level}</span>
                        </div>
                    </div>
                ))
            )}
        </Section>
    );
};
