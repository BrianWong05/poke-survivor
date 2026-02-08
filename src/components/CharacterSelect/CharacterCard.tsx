import type { CharacterConfig } from '@/game/entities/characters/types'; // Updated to use @ alias
import { useTranslation } from 'react-i18next';

interface CharacterCardProps {
  character: CharacterConfig;
  isSelected: boolean;
  onSelect: (character: CharacterConfig) => void;
}

export function CharacterCard({ character, isSelected, onSelect }: CharacterCardProps) {
  const { t } = useTranslation();

  return (
    <button
      className={`bg-white/5 border-2 border-white/10 rounded-2xl p-4 md:p-6 cursor-pointer transition-all duration-300 ease-out text-left hover:-translate-y-[5px] hover:border-white/30 hover:bg-white/10 ${
        isSelected
          ? 'border-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.3)] bg-[#FFD700]/10'
          : ''
      }`}
      onClick={() => onSelect(character)}
    >
      <div className="w-[60px] h-[60px] md:w-20 md:h-20 mx-auto mb-4 rounded-full overflow-hidden bg-black/30 flex items-center justify-center">
        <div
          className="bg-no-repeat [image-rendering:pixelated] scale-150 animate-[play-sprite_0.8s_steps(var(--frame-count))_infinite]"
          style={
            {
              width: `${getSpriteMeta(character.id).w}px`,
              height: `${getSpriteMeta(character.id).h}px`,
              backgroundImage: `url(${getCharacterSprite(character.id)})`,
              '--frame-count': getSpriteMeta(character.id).frames,
              '--frame-width': `${getSpriteMeta(character.id).w}px`,
            } as React.CSSProperties
          }
        />
      </div>
      <h2 className="text-[1.2rem] md:text-[1.5rem] text-white m-0 mb-2">
        {t(character.nameKey)}
      </h2>
      <p className="text-[0.9rem] text-[#888] m-0 mb-4 italic">
        {t(character.archetypeKey)}
      </p>
      <div className="flex gap-4 mb-4">
        <span className="text-[0.9rem] text-[#ddd] bg-black/30 px-2 py-1 rounded">
          ❤️ {character.stats.maxHP}
        </span>
        <span className="text-[0.9rem] text-[#ddd] bg-black/30 px-2 py-1 rounded">
          ⚡ {character.stats.speed}
        </span>
        <span className="text-[0.9rem] text-[#ddd] bg-black/30 px-2 py-1 rounded">
          ⚔️ {character.stats.baseDamage}
        </span>
      </div>
      <p className="text-[0.85rem] text-[#aaa] m-0 leading-[1.4]">
        <strong className="text-[#FFD700]">
          {t(character.passive.nameKey)}:
        </strong>{' '}
        {t(character.passive.descKey)}
      </p>
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
