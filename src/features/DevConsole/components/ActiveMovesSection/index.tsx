import React from 'react';
import { Section } from '@/features/DevConsole/components/Shared/Section';
import { styles } from '@/features/DevConsole/styles';
import { type ActiveWeapon } from '@/features/DevConsole/types';
import { ActiveMoveRow } from '@/features/DevConsole/components/ActiveMovesSection/ActiveMoveRow';

interface ActiveMovesSectionProps {
    activeWeapons: ActiveWeapon[];
    onRemove: (id: string) => void;
    onSetLevel: (id: string, level: number) => void;
}

export const ActiveMovesSection: React.FC<ActiveMovesSectionProps> = ({ activeWeapons, onRemove, onSetLevel }) => {
    return (
        <Section title="Active Moves">
            {activeWeapons.length === 0 ? (
                <div style={styles.hint}>No debug moves active.</div>
            ) : (
                activeWeapons.map(w => (
                    <ActiveMoveRow 
                        key={w.id} 
                        weapon={w} 
                        onRemove={onRemove} 
                        onSetLevel={onSetLevel} 
                    />
                ))
            )}
        </Section>
    );
};
