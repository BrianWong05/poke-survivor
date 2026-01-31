import React from 'react';
import { Section } from '@/features/DevConsole/components/Shared/Section';
import { Button } from '@/features/DevConsole/components/Shared/Button';
import { styles } from '@/features/DevConsole/styles';
import { AVAILABLE_MOVES } from '@/features/DevConsole/constants';
// import { DevMove } from '@/features/DevConsole/types'; // Not used directly in JSX, but type is used in constants

interface MovesRegistrySectionProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onAddWeapon: (weaponConfig: any) => void;
}

export const MovesRegistrySection: React.FC<MovesRegistrySectionProps> = ({ searchQuery, onSearchChange, onAddWeapon }) => {
    
    const filteredMoves = AVAILABLE_MOVES.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Section title="All Moves Registry">
                <div style={styles.hint}>
                Adds a generic weapon instance.
            </div>
            
            <input 
                type="text" 
                placeholder="Search moves..." 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                style={styles.searchInput}
            />

            <div style={styles.scrollList}>
                {filteredMoves.length === 0 ? (
                    <div style={styles.hint}>No moves found.</div>
                ) : (
                    filteredMoves.map((move, i) => (
                        <Button key={i} onClick={() => onAddWeapon(move.create())} outline={move.outline}>
                            {move.name}
                        </Button>
                    ))
                )}
            </div>
        </Section>
    );
};
