import React from 'react';
import { Section } from '@/features/DevConsole/components/Shared/Section';
import { Button } from '@/features/DevConsole/components/Shared/Button';
import { styles } from '@/features/DevConsole/styles';
import { AVAILABLE_ITEMS } from '@/game/entities/items/registry';

interface ItemsRegistrySectionProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onAddItem: (id: string) => void;
}

export const ItemsRegistrySection: React.FC<ItemsRegistrySectionProps> = ({
    searchQuery,
    onSearchChange,
    onAddItem
}) => {
    const filteredItems = AVAILABLE_ITEMS.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Section title="All Items Registry">
            <div style={styles.hint}>
                Adds a passive item to player inventory.
            </div>
            
            <input 
                type="text" 
                placeholder="Search items..." 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                style={styles.searchInput}
            />

            <div style={styles.scrollList}>
                {filteredItems.length === 0 ? (
                    <div style={styles.hint}>No items found.</div>
                ) : (
                    filteredItems.map(item => (
                        <Button 
                            key={item.id}
                            onClick={() => onAddItem(item.id)}
                            outline={true}
                        >
                            {item.name}
                        </Button>
                    ))
                )}
            </div>
        </Section>
    );
};
