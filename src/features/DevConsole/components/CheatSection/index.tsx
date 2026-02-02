import React from 'react';
import { Section } from '@/features/DevConsole/components/Shared/Section';
import { Button } from '@/features/DevConsole/components/Shared/Button';

interface CheatSectionProps {
    handleCheat: (action: string) => void;
    isInvincible: boolean;
    showMagnetRange: boolean;
}

export const CheatSection: React.FC<CheatSectionProps> = ({ handleCheat, isInvincible, showMagnetRange }) => {
    return (
        <Section title="Cheats">
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input 
                    type="number" 
                    placeholder="Set Level" 
                    id="cheat-set-level-input"
                    style={{ 
                        flex: 1, 
                        padding: '8px', 
                        borderRadius: '4px', 
                        border: '1px solid #444', 
                        background: '#222', 
                        color: 'white' 
                    }}
                    min="1"
                />
                <Button 
                    onClick={() => {
                        const input = document.getElementById('cheat-set-level-input') as HTMLInputElement;
                        if (input && input.value) {
                            handleCheat(`setLevel:${input.value}`);
                            input.value = '';
                        }
                    }} 
                    color="#f1c40f"
                >
                    Set
                </Button>
            </div>
            <Button onClick={() => handleCheat('lvl')} color="#f1c40f">Level Up (+1)</Button>
            <Button onClick={() => handleCheat('lvl-5')} color="#f39c12">Level Up (+5)</Button>
            <Button onClick={() => handleCheat('heal')} color="#2ecc71">Full Heal</Button>
            <Button onClick={() => handleCheat('invincible')} color="#9b59b6" outline={!isInvincible}>
                {isInvincible ? 'Invincible Mode (ON)' : 'Invincible Mode (OFF)'}
            </Button>
            <Button onClick={() => handleCheat('toggle-magnet-range')} color="#27ae60" outline={!showMagnetRange}>
                {showMagnetRange ? 'Show Magnet Range (ON)' : 'Show Magnet Range (OFF)'}
            </Button>
            <Button onClick={() => handleCheat('kill')} color="#e74c3c">Kill All Enemies</Button>
        </Section>
    );
};
