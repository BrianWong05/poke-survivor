import React from 'react';
import { Section } from '../Shared/Section';
import { Button } from '../Shared/Button';

interface CheatSectionProps {
    handleCheat: (action: string) => void;
    isInvincible: boolean;
}

export const CheatSection: React.FC<CheatSectionProps> = ({ handleCheat, isInvincible }) => {
    return (
        <Section title="Cheats">
            <Button onClick={() => handleCheat('lvl')} color="#f1c40f">Level Up (Instant)</Button>
            <Button onClick={() => handleCheat('heal')} color="#2ecc71">Full Heal</Button>
            <Button onClick={() => handleCheat('invincible')} color="#9b59b6" outline={!isInvincible}>
                {isInvincible ? 'Invincible Mode (ON)' : 'Invincible Mode (OFF)'}
            </Button>
            <Button onClick={() => handleCheat('kill')} color="#e74c3c">Kill All Enemies</Button>
        </Section>
    );
};
