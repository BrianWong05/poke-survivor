import React, { useRef } from 'react';
import { useDevConsole } from './useDevConsole';
import { styles } from './styles';
import { Header } from './components/Header';
import { CheatSection } from './components/CheatSection';
import { ActiveMovesSection } from './components/ActiveMovesSection';
import { MovesRegistrySection } from './components/MovesRegistrySection';

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
        activeWeapons,
        handleCheat,
        handleAddWeapon,
        handleRemoveWeapon,
        handleSetLevel
    } = useDevConsole();

    const overlayRef = useRef<HTMLDivElement>(null);    

    if (!isVisible) return null;

    return (
        <div style={styles.overlay} ref={overlayRef}>
            <Header 
                isPaused={isPaused} 
                onTogglePause={() => setIsPaused(!isPaused)} 
                onClose={() => setIsVisible(false)} 
            />
            
            <CheatSection 
                handleCheat={handleCheat} 
                isInvincible={isInvincible} 
            />

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
