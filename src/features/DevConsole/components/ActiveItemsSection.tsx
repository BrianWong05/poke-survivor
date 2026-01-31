import React from 'react';
import { Section } from '@/features/DevConsole/components/Shared/Section';
import { styles } from '@/features/DevConsole/styles';
import { type ActiveItem } from '@/features/DevConsole/types';

interface ActiveItemsSectionProps {
    activeItems: ActiveItem[];
    onRemove: (id: string) => void;
    onSetLevel: (id: string, level: number) => void;
}

export const ActiveItemsSection: React.FC<ActiveItemsSectionProps> = ({ 
    activeItems,
    onRemove,
    onSetLevel
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
                            <button 
                                onClick={() => onSetLevel(item.id, item.level - 1)}
                                style={styles.levelBtn}
                            >
                                -
                            </button>
                            <span style={styles.levelDisplay}>Lvl {item.level}</span>
                            <button 
                                onClick={() => onSetLevel(item.id, item.level + 1)}
                                style={styles.levelBtn}
                            >
                                +
                            </button>
                        </div>
                        <button 
                            onClick={() => onRemove(item.id)}
                            style={styles.removeBtn}
                            title="Remove Item"
                        >
                            ×
                        </button>
                    </div>
                ))
            )}
        </Section>
    );
};
