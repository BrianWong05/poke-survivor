import { useState, useEffect } from 'react';
import { type WeaponConfig } from '@/game/entities/characters/types';

import { type ActiveWeapon, type ActiveItem } from './types';

export const useDevConsole = () => {
    // Internal Production Gate (Runtime Safety) is handled in the component
    
    const [isVisible, setIsVisible] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isInvincible, setIsInvincible] = useState(false);
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
             if (scene && scene.getDebugWeapons) {
                 setActiveWeapons(scene.getDebugWeapons());
             }
             if (scene && scene.debugSystem && scene.debugSystem.player) {
                 // Fetch items directly from player if exposed, or via debugSystem helper
                 // We didn't create getDebugItems yet in MainScene/DevDebugSystem, need to check or add it?
                 // Wait, I didn't add getDebugItems in Step 214? 
                 // Checked DevDebugSystem.ts (Step 216), I only added debugAddItem.
                 // I need to add getDebugItems to DevDebugSystem.ts first? OR just read player.items if exposed?
                 // Player is private in DevDebugSystem but debugSystem is private in MainScene.
                 // MainScene exposes "getDebugWeapons".
                 // Let's assume I'll add "getDebugItems" to MainScene/DevDebugSystem in a moment.
                 if (scene.getDebugItems) {
                     setActiveItems(scene.getDebugItems());
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
        if (gameScene && gameScene.debugSetPaused) {
             gameScene.debugSetPaused(isPaused);
        }
    }, [isPaused]);

    const handleCheat = (action: string) => {
        const gameScene = (window as any).gameScene;
        if (!gameScene) {
            console.warn("DevConsole: generic gameScene not found on window.");
            return;
        }
        
        switch(action) {
            case 'lvl': 
                if (gameScene.debugLevelUp) gameScene.debugLevelUp(); 
                else console.warn("debugLevelUp not implemented on scene");
                break;
            case 'heal': 
                if (gameScene.debugHeal) gameScene.debugHeal();
                break;
            case 'kill': 
                if (gameScene.debugKillAll) gameScene.debugKillAll();
                break;
            case 'invincible':
                if (gameScene.debugSetInvincible) {
                    const newState = !isInvincible;
                    gameScene.debugSetInvincible(newState);
                    setIsInvincible(newState);
                }
                break;
        }
    };

    const handleAddWeapon = (config: WeaponConfig) => {
        const gameScene = (window as any).gameScene;
        if (gameScene && gameScene.debugAddWeapon) {
            gameScene.debugAddWeapon(config);
            // Instant update
            if (gameScene.getDebugWeapons) {
                setActiveWeapons(gameScene.getDebugWeapons());
            }
        } else {
             console.warn("debugAddWeapon not found on scene");
        }
    };

    const handleRemoveWeapon = (id: string) => {
        const gameScene = (window as any).gameScene;
         if (gameScene && gameScene.debugRemoveWeapon) {
            gameScene.debugRemoveWeapon(id);
            if (gameScene.getDebugWeapons) {
                setActiveWeapons(gameScene.getDebugWeapons());
            }
        }
    };

    const handleSetLevel = (id: string, newLevel: number) => {
        if (newLevel < 1) return;
        // Strict Cap at 8 for UI
        if (newLevel > 8) newLevel = 8;
        
        const gameScene = (window as any).gameScene;
         if (gameScene && gameScene.debugSetWeaponLevel) {
            gameScene.debugSetWeaponLevel(id, newLevel);
            if (gameScene.getDebugWeapons) {
                setActiveWeapons(gameScene.getDebugWeapons());
            }
        }
    };



    const handleAddItem = (id: string) => {
        const gameScene = (window as any).gameScene;
        if (gameScene && gameScene.debugAddItem) {
            gameScene.debugAddItem(id);
            // Instant update attempt
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
        handleAddItem
    };
};
