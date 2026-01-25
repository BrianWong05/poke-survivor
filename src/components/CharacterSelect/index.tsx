import { useState } from 'react';
import { getAllCharacters } from '@/game/entities/characters/registry';
import type { CharacterConfig } from '@/game/entities/characters/types';
import './styles.css';
import { DexScreen } from '@/components/Menus/DexScreen';

interface CharacterSelectProps {
  onSelect: (characterId: string) => void;
}

export function CharacterSelect({ onSelect }: CharacterSelectProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDex, setShowDex] = useState(false);
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
        
        <button className="dex-button" onClick={() => setShowDex(true)}>
          📖 PokéDex
        </button>

        {showDex && <DexScreen onClose={() => setShowDex(false)} />}
        
        <div className="character-grid">
          {characters.map((character) => (
            <button
              key={character.id}
              className={`character-card ${selectedId === character.id ? 'selected' : ''}`}
              onClick={() => handleSelect(character)}
            >
              <div className="character-sprite">
                <div
                  className="sprite-animator"
                  style={{
                    width: `${getSpriteMeta(character.id).w}px`,
                    height: `${getSpriteMeta(character.id).h}px`,
                    backgroundImage: `url(${getCharacterSprite(character.id)})`,
                    '--frame-count': getSpriteMeta(character.id).frames,
                    '--frame-width': `${getSpriteMeta(character.id).w}px`,
                  } as React.CSSProperties}
                />
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

function getCharacterSprite(id: string): string {
  // Map character IDs to their sprite assets (using idle-down frame)
  const spriteMap: Record<string, string> = {
    pikachu: 'assets/sprites/25-idle.png',
    charmander: 'assets/sprites/4-idle.png',
    squirtle: 'assets/sprites/7-idle.png',
    gastly: 'assets/sprites/92-idle.png',
    riolu: 'assets/sprites/447-idle.png',
    snorlax: 'assets/sprites/143-idle.png',
  };
  return spriteMap[id] || 'assets/vite.svg';
}

function getSpriteMeta(id: string) {
  const meta: Record<string, { w: number; h: number; frames: number }> = {
    pikachu: { w: 40, h: 56, frames: 6 },
    charmander: { w: 32, h: 40, frames: 4 },
    squirtle: { w: 32, h: 32, frames: 8 },
    gastly: { w: 48, h: 56, frames: 6 },
    riolu: { w: 32, h: 40, frames: 4 },
    snorlax: { w: 32, h: 64, frames: 6 },
  };
  return meta[id] || { w: 32, h: 32, frames: 1 };
}
