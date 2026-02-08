import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllCharacters } from '@/game/entities/characters/registry';
import type { CharacterConfig } from '@/game/entities/characters/types';
import { DexScreen } from '@/components/Menus/DexScreen';
import { LanguageToggle } from '@/components/Shared/LanguageToggle';
import { CharacterCard } from './CharacterCard';
import styles from './styles.module.css';

interface CharacterSelectProps {
  onSelect: (characterId: string) => void;
  onOpenLevelEditor?: () => void;
}

export function CharacterSelect({ onSelect, onOpenLevelEditor }: CharacterSelectProps) {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDex, setShowDex] = useState(false);
  const characters = getAllCharacters().filter(c => !c.hidden);

  const handleSelect = (character: CharacterConfig) => {
    setSelectedId(character.id);
  };

  const handleConfirm = () => {
    if (selectedId) {
      onSelect(selectedId);
    }
  };

  if (showDex) {
    return <DexScreen onClose={() => setShowDex(false)} />;
  }

  return (
    <div className={styles.overlay}>
      {/* Dynamic keyframes for sprite animation */}
      <style>{`
        @keyframes play-sprite {
          from { background-position-x: 0; }
          to { background-position-x: calc(-1 * var(--frameWidth) * var(--frameCount)); }
        }
      `}</style>
      
      <div className={styles.content}>
        <LanguageToggle />
        <div className={styles.container}>
          <h1 className={styles.title}>
            {t('choose_pokemon')}
          </h1>
        
          <button 
            className={styles.dexButton} 
            onClick={() => setShowDex(true)}
          >
            📖 {t('pokedex')}
          </button>
        
          <div className={styles.grid}>
            {characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                isSelected={selectedId === character.id}
                onSelect={handleSelect}
              />
            ))}
          </div>

          <div className={styles.buttonGroup}>
            <button
              className={styles.confirmButton}
              disabled={!selectedId}
              onClick={handleConfirm}
            >
              {t('start_game')}
            </button>
            {onOpenLevelEditor && (
              <button
                className={styles.editorButton}
                onClick={onOpenLevelEditor}
              >
                🗺️ Level Editor
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
