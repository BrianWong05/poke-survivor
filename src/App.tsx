import { useState, useCallback } from 'react';
import { GameCanvas } from '@/components/GameCanvas';
import { HUD } from '@/components/HUD';
import { CharacterSelect } from '@/components/CharacterSelect';

function App() {
  const [score, setScore] = useState(0);
  const [hp, setHP] = useState(100);
  const [maxHP, setMaxHP] = useState(100);
  const [level, setLevel] = useState(1);
  const [xp, setXP] = useState(0);
  const [xpToNext, setXPToNext] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);

  const handleHPUpdate = useCallback((newHP: number) => {
    setHP(newHP);
  }, []);

  const handleLevelUpdate = useCallback((newLevel: number, newXP: number, newXPToNext: number) => {
    setLevel(newLevel);
    setXP(newXP);
    setXPToNext(newXPToNext);
  }, []);

  const handleGameOver = useCallback(() => {
    setIsGameOver(true);
  }, []);

  const handleCharacterSelect = useCallback((characterId: string) => {
    setSelectedCharacter(characterId);
    // Reset game state for new character
    setScore(0);
    setLevel(1);
    setXP(0);
    setXPToNext(100);
    setIsGameOver(false);
  }, []);

  const handleRestart = useCallback(() => {
    // Go back to character select
    setSelectedCharacter(null);
    setScore(0);
    setHP(100);
    setMaxHP(100);
    setLevel(1);
    setXP(0);
    setXPToNext(100);
    setIsGameOver(false);
    setGameKey(prev => prev + 1);
  }, []);

  // Show character select screen if no character chosen
  if (!selectedCharacter) {
    return <CharacterSelect onSelect={handleCharacterSelect} />;
  }

  return (
    <>
      <GameCanvas
        key={gameKey}
        selectedCharacter={selectedCharacter}
        onScoreUpdate={handleScoreUpdate}
        onHPUpdate={handleHPUpdate}
        onLevelUpdate={handleLevelUpdate}
        onGameOver={handleGameOver}
        onQuit={handleRestart}
        onMaxHPChange={setMaxHP}
      />
      <HUD
        score={score}
        hp={hp}
        maxHP={maxHP}
        level={level}
        xp={xp}
        xpToNext={xpToNext}
        isGameOver={isGameOver}
        onRestart={handleRestart}
      />
    </>
  );
}

export default App;
