import React, { useState, useEffect, useRef } from 'react';
import { 
    FLAME_WHEEL_CONFIG, 
    AQUA_RING_CONFIG, 
    MAGICAL_LEAF_CONFIG,
    FIRE_SPIN_CONFIG,
    HYDRO_RING_CONFIG,
    LEAF_STORM_CONFIG,
    type OrbitVariantConfig 
} from '@/game/entities/weapons/general/OrbitWeapon';
// Specific Weapons
import { Ember, Flamethrower } from '@/game/entities/weapons/specific/Ember';
import { WaterGun, HydroPump } from '@/game/entities/weapons/specific/WaterGun';
import { ThunderShock, Thunderbolt } from '@/game/entities/weapons/specific/ThunderShock';
import { Lick, DreamEater } from '@/game/entities/weapons/specific/Lick';
import { AuraSphere } from '@/game/entities/weapons/specific/AuraSphere';
import { FocusBlast } from '@/game/entities/weapons/specific/FocusBlast';
import { BodySlam } from '@/game/entities/weapons/specific/BodySlam';
import { BoneRush } from '@/game/entities/weapons/specific/BoneRush';
import { type WeaponConfig } from '@/game/entities/characters/types';

export const DevConsole: React.FC = () => {
    // Internal Production Gate (Runtime Safety)
    if (!import.meta.env.DEV) return null;

    const [isVisible, setIsVisible] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isInvincible, setIsInvincible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeWeapons, setActiveWeapons] = useState<{ id: string, name: string, level: number }[]>([]);
    const overlayRef = useRef<HTMLDivElement>(null);    
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

    if (!isVisible) return null;

    const gameScene = (window as any).gameScene;

    const handleCheat = (action: string) => {
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

    const handleAddWeapon = (config: OrbitVariantConfig | WeaponConfig) => {
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
         if (gameScene && gameScene.debugRemoveWeapon) {
            gameScene.debugRemoveWeapon(id);
            if (gameScene.getDebugWeapons) {
                setActiveWeapons(gameScene.getDebugWeapons());
            }
        }
    };

    const handleSetLevel = (id: string, newLevel: number) => {
        if (newLevel < 1) return;
         if (gameScene && gameScene.debugSetWeaponLevel) {
            gameScene.debugSetWeaponLevel(id, newLevel);
            if (gameScene.getDebugWeapons) {
                setActiveWeapons(gameScene.getDebugWeapons());
            }
        }
    };

    // Available Moves Data
    const AVAILABLE_MOVES = [
        { name: 'Ember', create: () => new Ember() },
        { name: 'Flamethrower', create: () => new Flamethrower(), outline: true },
        { name: 'Water Gun', create: () => new WaterGun() },
        { name: 'Hydro Pump', create: () => new HydroPump(), outline: true },
        { name: 'Thunder Shock', create: () => new ThunderShock() },
        { name: 'Thunderbolt', create: () => new Thunderbolt(), outline: true },
        { name: 'Lick', create: () => new Lick() },
        { name: 'Dream Eater', create: () => new DreamEater(), outline: true },
        { name: 'Aura Sphere', create: () => new AuraSphere() },
        { name: 'Focus Blast', create: () => new FocusBlast(), outline: true },
        { name: 'Body Slam', create: () => new BodySlam() },
        { name: 'Bone Rush', create: () => new BoneRush() },
        // Orbit Weapons
        { name: 'Flame Wheel', create: () => FLAME_WHEEL_CONFIG, outline: false },
        { name: 'Fire Spin', create: () => FIRE_SPIN_CONFIG, outline: true },
        { name: 'Aqua Ring', create: () => AQUA_RING_CONFIG, outline: false },
        { name: 'Hydro Ring', create: () => HYDRO_RING_CONFIG, outline: true },
        { name: 'Magical Leaf', create: () => MAGICAL_LEAF_CONFIG, outline: false },
        { name: 'Leaf Storm', create: () => LEAF_STORM_CONFIG, outline: true },
    ];


    const filteredMoves = AVAILABLE_MOVES.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={styles.overlay} ref={overlayRef}>
            <div style={styles.header}>
                <div style={styles.titleGroup}>
                    <h2>Dev Console</h2>
                    <button 
                        onClick={() => setIsPaused(!isPaused)} 
                        style={{ ...styles.pauseBtn, color: isPaused ? '#f1c40f' : '#2ecc71' }}
                    >
                        {isPaused ? '▶ Resume Game' : '⏸ Pause Game'}
                    </button>
                </div>
                <button onClick={() => setIsVisible(false)} style={styles.closeBtn}>×</button>
            </div>
            
            <Section title="Cheats">
                <Button onClick={() => handleCheat('lvl')} color="#f1c40f">Level Up (Instant)</Button>
                <Button onClick={() => handleCheat('heal')} color="#2ecc71">Full Heal</Button>
                <Button onClick={() => handleCheat('invincible')} color="#9b59b6" outline={!isInvincible}>
                    {isInvincible ? 'Invincible Mode (ON)' : 'Invincible Mode (OFF)'}
                </Button>
                <Button onClick={() => handleCheat('kill')} color="#e74c3c">Kill All Enemies</Button>
            </Section>

            <Section title="Active Moves">
                {activeWeapons.length === 0 ? (
                    <div style={styles.hint}>No debug moves active.</div>
                ) : (
                    activeWeapons.map(w => (
                        <div key={w.id} style={styles.activeRow}>
                            <div style={{flex: 1}}>
                                <span style={{fontWeight: 'bold'}}>{w.name}</span>
                            </div>
                            <div style={styles.levelControls}>
                                <button onClick={() => handleSetLevel(w.id, w.level - 1)} style={styles.levelBtn}>-</button>
                                <span style={styles.levelDisplay}>Lvl {w.level}</span>
                                <button onClick={() => handleSetLevel(w.id, w.level + 1)} style={styles.levelBtn}>+</button>
                            </div>
                            <button onClick={() => handleRemoveWeapon(w.id)} style={styles.removeBtn}>×</button>
                        </div>
                    ))
                )}
            </Section>



            <Section title="All Moves Registry">
                 <div style={styles.hint}>
                    Adds a generic weapon instance.
                </div>
                
                <input 
                    type="text" 
                    placeholder="Search moves..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={styles.searchInput}
                />

                <div style={styles.scrollList}>
                    {filteredMoves.length === 0 ? (
                        <div style={styles.hint}>No moves found.</div>
                    ) : (
                        filteredMoves.map((move, i) => (
                            <Button key={i} onClick={() => handleAddWeapon(move.create())} outline={move.outline}>
                                {move.name}
                            </Button>
                        ))
                    )}
                </div>
            </Section>


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

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{title}</h3>
        {children}
    </div>
);



interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    outline?: boolean;
    color?: string;
}

const Button: React.FC<ButtonProps> = ({ children, outline, color, style, ...props }) => {
    const [hover, setHover] = useState(false);
    
    const baseColor = color || '#ffffff';
    const bg = outline ? 'transparent' : (hover ? lighten(baseColor, 20) : baseColor);
    const fg = outline ? baseColor : (isBright(baseColor) ? '#000' : '#fff');
    const border = `1px solid ${baseColor}`;

    return (
        <button 
            style={{
                ...styles.button,
                backgroundColor: bg,
                color: fg,
                border: border,
                ...style
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            {...props}
        >
            {children}
        </button>
    );
};

// Simple Styles
const styles: Record<string, React.CSSProperties> = {
    overlay: {
        position: 'fixed' as const,
        top: 0,
        right: 0,
        width: '320px',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: '#eee',
        padding: '20px', 
        boxSizing: 'border-box',
        overflowY: 'auto', 
        zIndex: 10000,
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        backdropFilter: 'blur(4px)',
        borderLeft: '1px solid #333',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #444',
        marginBottom: '20px',
        paddingBottom: '10px',
    },
    content: {
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
    },
    titleGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    pauseBtn: {
        background: 'none',
        border: '1px solid #444',
        borderRadius: '4px',
        padding: '6px 12px',
        fontSize: '13px',
        cursor: 'pointer',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginTop: '4px',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: '#888',
        fontSize: '24px',
        cursor: 'pointer',
    },
    section: {
        marginBottom: '24px',
    },
    sectionTitle: {
        fontSize: '14px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: '#888',
        borderBottom: '1px solid #333',
        paddingBottom: '4px',
        marginBottom: '12px',
    },
    button: {
        display: 'block',
        width: '100%',
        padding: '8px 12px',
        marginBottom: '8px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '13px',
        transition: 'all 0.2s',
        textAlign: 'center',
    },

    hint: {
        fontSize: '11px',
        color: '#666',
        marginBottom: '10px',
        fontStyle: 'italic',
    },
    activeRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px',
        backgroundColor: '#333',
        marginBottom: '4px',
        borderRadius: '4px',
        fontSize: '12px',
    },
    removeBtn: {
        background: 'none',
        border: 'none',
        color: '#ff6b6b',
        cursor: 'pointer',
        fontWeight: 'bold',
        padding: '0 4px',
    },
    searchInput: {
        width: '100%',
        padding: '8px',
        marginBottom: '10px',
        backgroundColor: '#222',
        border: '1px solid #444',
        borderRadius: '4px',
        color: '#eee',
        fontSize: '13px',
    },
    scrollList: {
        // maxHeight: '300px', // Removed to show all items
        overflowY: 'visible',
        paddingRight: '4px',
    },
    footer: {
        marginTop: '30px',
        paddingTop: '20px',
        paddingBottom: '40px',
        display: 'flex',
        justifyContent: 'center',
        borderTop: '1px solid #333',
    },
    scrollTopBtn: {
        backgroundColor: '#333',
        color: '#fff',
        border: '1px solid #555',
        borderRadius: '20px',
        padding: '8px 24px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        transition: 'all 0.2s',
        outline: 'none',
    },
    levelControls: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginRight: '8px',
        backgroundColor: '#222',
        borderRadius: '12px',
        padding: '2px 4px',
    },
    levelBtn: {
        background: 'none',
        border: 'none',
        color: '#888',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        padding: '0 4px',
        width: '20px',
        textAlign: 'center',
    },
    levelDisplay: {
        fontSize: '11px',
        color: '#ccc',
        minWidth: '35px',
        textAlign: 'center',
        fontWeight: 'bold',
    },

};

// Utils for colors
function isBright(hex: string) {
    // Very rough heuristic
    return hex === '#ffffff' || hex === '#f1c40f' || hex === '#2ecc71';
}

function lighten(color: string, _amount: number) {
    // Placeholder interaction
    return color; 
}
