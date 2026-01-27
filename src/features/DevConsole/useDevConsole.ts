import { useState, useEffect } from 'react';
import { type WeaponConfig } from '@/game/entities/characters/types';

import { type ActiveWeapon } from './types';

export const useDevConsole = () => {
    // Internal Production Gate (Runtime Safety) is handled in the component
    
    const [isVisible, setIsVisible] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isInvincible, setIsInvincible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeWeapons, setActiveWeapons] = useState<ActiveWeapon[]>([]);
    
    // Poll for active weapons when visible
    useEffect(() => {
        if (!isVisible) return;
        
        const pollInterval = setInterval(() => {
             const gameScene = (window as any).gameScene;
             if (gameScene && gameScene.getDebugWeapons) {
                 setActiveWeapons(gameScene.getDebugWeapons());
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
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

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
        const gameScene = (window as any).gameScene;
         if (gameScene && gameScene.debugSetWeaponLevel) {
            gameScene.debugSetWeaponLevel(id, newLevel);
            if (gameScene.getDebugWeapons) {
                setActiveWeapons(gameScene.getDebugWeapons());
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
        activeWeapons,
        handleCheat,
        handleAddWeapon,
        handleRemoveWeapon,
        handleSetLevel
    };
};
