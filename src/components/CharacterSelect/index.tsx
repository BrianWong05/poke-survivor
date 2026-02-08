import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllCharacters } from '@/game/entities/characters/registry';
import type { CharacterConfig } from '@/game/entities/characters/types';
import { DexScreen } from '@/components/Menus/DexScreen';
import { LanguageToggle } from '@/components/Shared/LanguageToggle';
import { CharacterCard } from './CharacterCard';

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && selectedId && !showDex) {
        onSelect(selectedId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, showDex, onSelect]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] z-[1000] overflow-y-auto">
      {/* Dynamic keyframes for sprite animation */}
      <style>{`
        @keyframes play-sprite {
          from { background-position-x: 0; }
          to { background-position-x: calc(-1 * var(--frame-width) * var(--frame-count)); }
        }
      `}</style>
      
      <div className="min-h-full flex flex-col items-center justify-center py-10 px-5">
        <LanguageToggle />
        <div className="max-w-[1200px] w-full text-center flex flex-col items-center gap-8">
          <h1 className="text-[1.8rem] md:text-[2.5rem] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            {t('choose_pokemon')}
          </h1>
        
        <button 
          className="bg-transparent border-2 border-white/30 rounded-lg px-6 py-3 text-base text-white cursor-pointer transition-all duration-200 inline-flex items-center gap-2 hover:bg-white/10 hover:border-white hover:-translate-y-0.5" 
          onClick={() => setShowDex(true)}
        >
          📖 {t('pokedex')}
        </button>

        {showDex && <DexScreen onClose={() => setShowDex(false)} />}
        
        <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              isSelected={selectedId === character.id}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            className="bg-gradient-to-br from-[#FFD700] to-[#FFA500] border-none rounded-xl h-16 min-w-[200px] px-8 flex items-center justify-center text-[1.2rem] font-bold text-[#1a1a2e] cursor-pointer transition-all duration-300 uppercase tracking-[2px] hover:scale-105 hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            disabled={!selectedId}
            onClick={handleConfirm}
          >
            {t('start_game')}
          </button>
          {onOpenLevelEditor && (
            <button
              className="bg-gradient-to-br from-[#10b981] to-[#059669] border-none rounded-xl h-16 min-w-[200px] px-8 flex items-center justify-center text-[1.1rem] font-bold text-white cursor-pointer transition-all duration-300 uppercase tracking-[1px] hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
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

