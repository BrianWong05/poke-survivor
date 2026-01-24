import { useState } from 'react';
import { getAllCharacters } from '@/game/entities/characters/registry';
import type { CharacterConfig } from '@/game/entities/characters/types';
import './styles.css';

interface CharacterSelectProps {
  onSelect: (characterId: string) => void;
}

export function CharacterSelect({ onSelect }: CharacterSelectProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const characters = getAllCharacters();

  const handleSelect = (character: CharacterConfig) => {
    setSelectedId(character.id);
  };

  const handleConfirm = () => {
    if (selectedId) {
      onSelect(selectedId);
    }
  };

  return (
    <div className="character-select-overlay">
      <div className="character-select-container">
        <h1 className="character-select-title">Choose Your Pokémon</h1>
        
        <div className="character-grid">
          {characters.map((character) => (
            <button
              key={character.id}
              className={`character-card ${selectedId === character.id ? 'selected' : ''}`}
              onClick={() => handleSelect(character)}
            >
              <div className="character-sprite">
                {/* Placeholder sprite box */}
                <div className="sprite-placeholder" style={{ 
                  backgroundColor: getCharacterColor(character.id) 
                }} />
              </div>
              <h2 className="character-name">{character.displayName}</h2>
              <p className="character-archetype">{character.archetype}</p>
              <div className="character-stats">
                <span className="stat">❤️ {character.stats.maxHP}</span>
                <span className="stat">⚡ {character.stats.speed}</span>
                <span className="stat">⚔️ {character.stats.baseDamage}</span>
              </div>
              <p className="character-passive">
                <strong>{character.passive.name}:</strong> {character.passive.description}
              </p>
            </button>
          ))}
        </div>

        <button
          className="confirm-button"
          disabled={!selectedId}
          onClick={handleConfirm}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}

function getCharacterColor(id: string): string {
  const colors: Record<string, string> = {
    pikachu: '#FFD700',
    charizard: '#FF6B35',
    blastoise: '#4169E1',
    gengar: '#8B008B',
    lucario: '#4682B4',
    snorlax: '#2F4F4F',
  };
  return colors[id] || '#666';
}
