import { useState, useEffect } from 'react';
import { type WeaponConfig } from '@/game/entities/characters/types';

import { type ActiveWeapon, type ActiveItem } from '@/features/DevConsole/types';

export const useDevConsole = () => {
    // Internal Production Gate (Runtime Safety) is handled in the component
    
    const [isVisible, setIsVisible] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isInvincible, setIsInvincible] = useState(false);
    const [showMagnetRange, setShowMagnetRange] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [itemSearchQuery, setItemSearchQuery] = useState('');
    const [activeWeapons, setActiveWeapons] = useState<ActiveWeapon[]>([]);
    const [activeItems, setActiveItems] = useState<ActiveItem[]>([]);
    
    // Poll for active weapons when visible
    useEffect(() => {
        const gameScene = (window as any).gameScene;
        if (gameScene) {
            gameScene.isDevConsoleOpen = isVisible;
        }

        if (!isVisible) return;
        
        const pollInterval = setInterval(() => {
             const scene = (window as any).gameScene;
             // Check debugSystem existence
             if (scene && scene.debugSystem) {
                 if (scene.debugSystem.getDebugWeapons) {
                     setActiveWeapons(scene.debugSystem.getDebugWeapons());
                 }
                 if (scene.debugSystem.getDebugItems) {
                     setActiveItems(scene.debugSystem.getDebugItems());
                 }
             }
        }, 500);
        
        return () => clearInterval(pollInterval);
    }, [isVisible]);
    
    useEffect(() => {
        // Double check for safety
        if (!import.meta.env.DEV) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '`') {
                setIsVisible(prev => {
                    const newState = !prev;
                    // Auto-pause when opening, auto-resume when closing
                    setIsPaused(newState); 
                    return newState;
                });
            }
            if (e.key === 'Escape') {
                if (isVisible) {
                    setIsPaused(prev => !prev);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isVisible]);

    // Sync pause state with game
    useEffect(() => {
        const gameScene = (window as any).gameScene;
        if (gameScene && gameScene.debugSystem && gameScene.debugSystem.debugSetPaused) {
             gameScene.debugSystem.debugSetPaused(isPaused);
        }
    }, [isPaused]);

    const handleCheat = (action: string) => {
        const gameScene = (window as any).gameScene;
        if (!gameScene || !gameScene.debugSystem) {
            console.warn("DevConsole: gameScene or debugSystem not found.");
            return;
        }
        
        switch(action) {
            case 'lvl': 
                if (gameScene.debugSystem.debugLevelUp) gameScene.debugSystem.debugLevelUp(false);
                break;
            case 'lvl-5':
                if (gameScene.debugSystem.debugAddLevels) gameScene.debugSystem.debugAddLevels(5);
                break;
            case 'heal': 
                if (gameScene.debugSystem.debugHeal) gameScene.debugSystem.debugHeal();
                break;
            case 'kill': 
                if (gameScene.debugSystem.debugKillAll) gameScene.debugSystem.debugKillAll();
                break;
            case 'invincible':
                if (gameScene.debugSystem.debugSetInvincible) {
                    const newState = !isInvincible;
                    gameScene.debugSystem.debugSetInvincible(newState);
                    setIsInvincible(newState);
                }
                break;
            case 'toggle-magnet-range':
                if (gameScene.debugSystem.debugToggleMagnetRange) {
                    const newState = !showMagnetRange;
                    gameScene.debugSystem.debugToggleMagnetRange(newState);
                    setShowMagnetRange(newState);
                }
                break;
            default:
                if (action.startsWith('setLevel:')) {
                    const targetLevel = parseInt(action.split(':')[1], 10);
                    if (!isNaN(targetLevel) && gameScene.debugSystem.debugSetLevel) {
                        gameScene.debugSystem.debugSetLevel(targetLevel);
                    }
                }
                break;
        }
    };

    const handleAddWeapon = (config: WeaponConfig) => {
        const gameScene = (window as any).gameScene;
        if (gameScene && gameScene.debugSystem && gameScene.debugSystem.debugAddWeapon) {
            // Pass false for unused isGameOver arg
            gameScene.debugSystem.debugAddWeapon(config, false);
            // Instant update
            if (gameScene.debugSystem.getDebugWeapons) {
                setActiveWeapons(gameScene.debugSystem.getDebugWeapons());
            }
        } else {
             console.warn("debugAddWeapon not found on scene");
        }
    };

    const handleRemoveWeapon = (id: string) => {
        const gameScene = (window as any).gameScene;
         if (gameScene && gameScene.debugSystem && gameScene.debugSystem.debugRemoveWeapon) {
            gameScene.debugSystem.debugRemoveWeapon(id);
            if (gameScene.debugSystem.getDebugWeapons) {
                setActiveWeapons(gameScene.debugSystem.getDebugWeapons());
            }
        }
    };

    const handleSetLevel = (id: string, newLevel: number) => {
        if (newLevel < 1) return;
        // Strict Cap at 8 for UI
        if (newLevel > 8) newLevel = 8;
        
        const gameScene = (window as any).gameScene;
         if (gameScene && gameScene.debugSystem && gameScene.debugSystem.debugSetWeaponLevel) {
            gameScene.debugSystem.debugSetWeaponLevel(id, newLevel);
            if (gameScene.debugSystem.getDebugWeapons) {
                setActiveWeapons(gameScene.debugSystem.getDebugWeapons());
            }
        }
    };



    const handleAddItem = (id: string) => {
        const gameScene = (window as any).gameScene;
        if (gameScene && gameScene.debugSystem && gameScene.debugSystem.debugAddItem) {
            gameScene.debugSystem.debugAddItem(id);
            // Instant update
            if (gameScene.debugSystem.getDebugItems) {
                setActiveItems(gameScene.debugSystem.getDebugItems());
            }
        }
    };

    const handleSetItemLevel = (id: string, newLevel: number) => {
        if (newLevel < 1) return;
        if (newLevel > 5) newLevel = 5; // Passive Max is usually 5

        const gameScene = (window as any).gameScene;
        if (gameScene && gameScene.debugSystem && gameScene.debugSystem.debugSetItemLevel) {
            gameScene.debugSystem.debugSetItemLevel(id, newLevel);
             // Instant update
            if (gameScene.debugSystem.getDebugItems) {
                setActiveItems(gameScene.debugSystem.getDebugItems());
            }
        } else {
            console.warn("[DevConsole] gameScene.debugSystem.debugSetItemLevel not found");
        }
    };

    const handleRemoveItem = (id: string) => {
        const gameScene = (window as any).gameScene;
        if (gameScene && gameScene.debugRemoveItem) {
            gameScene.debugRemoveItem(id);
            if (gameScene.getDebugItems) {
                setActiveItems(gameScene.getDebugItems());
            }
        }
    };

    return {
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
        showMagnetRange
    };
};
