import type { CharacterConfig } from '@/game/entities/characters/types';
import { useTranslation } from 'react-i18next';
import { Heart, Zap, Sword, Flame } from 'lucide-react';
import styles from './CharacterCard.module.css';

interface CharacterCardProps {
  character: CharacterConfig;
  isSelected: boolean;
  onSelect: (character: CharacterConfig) => void;
}

export function CharacterCard({ character, isSelected, onSelect }: CharacterCardProps) {
  const { t } = useTranslation();

  return (
    <button
      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
      onClick={() => onSelect(character)}
    >
      <div className={styles.header}>
        <div className={`${styles.avatarContainer} ${isSelected ? styles.avatarContainerSelected : ''}`}>
          <div className={styles.avatarInner}>
            <div
              className={styles.sprite}
              style={
                {
                  width: `${getSpriteMeta(character.id).w}px`,
                  height: `${getSpriteMeta(character.id).h}px`,
                  backgroundImage: `url(${getCharacterSprite(character.id)})`,
                  '--frameCount': getSpriteMeta(character.id).frames,
                  '--frameWidth': `${getSpriteMeta(character.id).w}px`,
                } as React.CSSProperties
              }
            />
          </div>
        </div>

        <div className={styles.info}>
          <h2 className={styles.name}>{t(character.nameKey)}</h2>
          
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <Heart size={20} color="#f87171" fill="rgba(248, 113, 113, 0.2)" />
              <span className={styles.statValue}>{character.stats.maxHP}</span>
            </div>
            <div className={styles.statItem}>
              <Zap size={20} color="#fbbf24" fill="rgba(251, 191, 36, 0.2)" />
              <span className={styles.statValue}>{character.stats.speed}</span>
            </div>
            <div className={styles.statItem}>
              <Sword size={20} color="#a1a1aa" fill="rgba(161, 161, 170, 0.2)" />
              <span className={styles.statValue}>{character.stats.baseDamage}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.passiveBox}>
        <div className={styles.passiveHeader}>
          <Flame size={16} color="#fbbf24" />
          <span className={styles.passiveLabel}>
            {t('passive') || 'Passive'}: {t(character.passive.nameKey)}
          </span>
        </div>
        <p className={styles.passiveDesc}>{t(character.passive.descKey)}</p>
      </div>
    </button>
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