import React, { useRef } from 'react';
import { useDevConsole } from '@/features/DevConsole/useDevConsole';
import { styles } from '@/features/DevConsole/styles';
import { Header } from '@/features/DevConsole/components/Header';
import { CheatSection } from '@/features/DevConsole/components/CheatSection';
import { ActiveMovesSection } from '@/features/DevConsole/components/ActiveMovesSection';
import { MovesRegistrySection } from '@/features/DevConsole/components/MovesRegistrySection';
import { ActiveItemsSection } from '@/features/DevConsole/components/ActiveItemsSection';
import { ItemsRegistrySection } from '@/features/DevConsole/components/ItemsRegistrySection';

export const DevConsole: React.FC = () => {
    // Internal Production Gate (Runtime Safety)
    if (!import.meta.env.DEV) return null;

    const {
        isVisible,
        setIsVisible,
        isPaused,
        setIsPaused,
        isInvincible,
        searchQuery,
        setSearchQuery,
        itemSearchQuery,
        setItemSearchQuery,
        activeWeapons,
        activeItems,
        handleCheat,
        handleAddWeapon,
        handleRemoveWeapon,
        handleSetLevel,
        handleAddItem,
        handleRemoveItem,
        handleSetItemLevel,
        showMagnetRange,
        showHitboxes
    } = useDevConsole();

    const overlayRef = useRef<HTMLDivElement>(null);    

    const [activeTab, setActiveTab] = React.useState<'weapons' | 'items' | 'cheats'>('weapons');

    if (!isVisible) return null;

    return (
        <div style={styles.overlay} ref={overlayRef}>
            <Header 
                isPaused={isPaused} 
                onTogglePause={() => setIsPaused(!isPaused)} 
                onClose={() => {
                    setIsVisible(false);
                    setIsPaused(false);
                }} 
            />
            
            <div style={styles.tabContainer}>
                <button 
                    style={{
                        ...styles.tabButton,
                        ...(activeTab === 'weapons' ? styles.activeTabButton : {})
                    }}
                    onClick={() => setActiveTab('weapons')}
                >
                    WEAPONS
                </button>
                <button 
                    style={{
                        ...styles.tabButton,
                        ...(activeTab === 'items' ? styles.activeTabButton : {})
                    }}
                    onClick={() => setActiveTab('items')}
                >
                    ITEMS
                </button>
                <button 
                    style={{
                        ...styles.tabButton,
                        ...(activeTab === 'cheats' ? styles.activeTabButton : {})
                    }}
                    onClick={() => setActiveTab('cheats')}
                >
                    CHEATS
                </button>
            </div>

            {activeTab === 'cheats' && (
                <CheatSection 
                    handleCheat={handleCheat} 
                    isInvincible={isInvincible} 
                    showMagnetRange={showMagnetRange}
                    showHitboxes={showHitboxes}
                />
            )}

            {activeTab === 'weapons' && (
                <>
                    <ActiveMovesSection 
                        activeWeapons={activeWeapons} 
                        onRemove={handleRemoveWeapon} 
                        onSetLevel={handleSetLevel} 
                    />

                    <MovesRegistrySection 
                        searchQuery={searchQuery} 
                        onSearchChange={setSearchQuery} 
                        onAddWeapon={handleAddWeapon} 
                    />
                </>
            )}

            {activeTab === 'items' && (
                <>
                    <ActiveItemsSection 
                        activeItems={activeItems} 
                        onRemove={handleRemoveItem}
                        onSetLevel={handleSetItemLevel}
                    />

                    <ItemsRegistrySection 
                        searchQuery={itemSearchQuery} 
                        onSearchChange={setItemSearchQuery} 
                        onAddItem={handleAddItem}
                    />
                </>
            )}

            <div style={styles.footer}>
                <button 
                    onClick={() => overlayRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                    style={styles.scrollTopBtn}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#444'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#333'}
                >
                    ↑ Scroll to Top
                </button>
            </div>
        </div>
    );
};
