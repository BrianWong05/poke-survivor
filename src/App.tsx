import { useState, useCallback } from 'react';
import { GameCanvas } from '@/components/GameCanvas';
import { HUD } from '@/components/HUD';
import { CharacterSelect } from '@/components/CharacterSelect';
import { DevConsole } from '@/features/DevConsole';
import { LevelEditor } from '@/components/LevelEditor';
import type { CustomMapData } from '@/game/types/map';

function App() {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [xp, setXP] = useState(0);
  const [xpToNext, setXPToNext] = useState(100);
  const [time, setTime] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [isLevelEditorMode, setIsLevelEditorMode] = useState(false);
  const [customMapData, setCustomMapData] = useState<CustomMapData | undefined>(undefined);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);

  const handleLevelUpdate = useCallback((newLevel: number, newXP: number, newXPToNext: number) => {
    setLevel(newLevel);
    setXP(newXP);
    setXPToNext(newXPToNext);
  }, []);

  const handleTimeUpdate = useCallback((newTime: number) => {
    setTime(newTime);
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
    setTime(0);
    setIsGameOver(false);
  }, []);

  const handleRestart = useCallback(() => {
    // Go back to character select
    setSelectedCharacter(null);
    setIsLevelEditorMode(false);
    setScore(0);
    setLevel(1);
    setXP(0);
    setXPToNext(100);
    setTime(0);
    setIsGameOver(false);
    setCustomMapData(undefined);
    setGameKey(prev => prev + 1);
  }, []);

  const handleOpenLevelEditor = useCallback(() => {
    setIsLevelEditorMode(true);
    // No character selected yet, we are in editor mode
    setSelectedCharacter('__editor__'); 
  }, []);

  const handlePlayCustomMap = useCallback((data: CustomMapData) => {
    setIsLevelEditorMode(false);
    setCustomMapData(data);
    setSelectedCharacter('pikachu'); // Default character for testing map
    // Force re-mount of game canvas
    setGameKey(prev => prev + 1);
  }, []);

  const handleExitEditor = useCallback(() => {
    setIsLevelEditorMode(false);
    setSelectedCharacter(null);
  }, []);

  const handleBackToEditor = useCallback(() => {
    setIsLevelEditorMode(true);
    setSelectedCharacter('__editor__');
    setGameKey(prev => prev + 1); // Ensure game is fully unmounted
  }, []);

  // Show character select screen if no character chosen
  if (!selectedCharacter) {
    return (
      <CharacterSelect
        onSelect={handleCharacterSelect}
        onOpenLevelEditor={handleOpenLevelEditor}
      />
    );
  }

  if (isLevelEditorMode) {
    return (
      <LevelEditor 
        onPlay={handlePlayCustomMap} 
        onExit={handleExitEditor} 
        initialData={customMapData}
      />
    );
  }

  return (
    <>
      <GameCanvas
        key={gameKey}
        selectedCharacter={selectedCharacter}
        startInLevelEditor={false} // Deprecated, we use React editor now
        customMapData={customMapData}
        onScoreUpdate={handleScoreUpdate}
        onLevelUpdate={handleLevelUpdate}
        onTimeUpdate={handleTimeUpdate}
        onGameOver={handleGameOver}
        onQuit={handleRestart}
      />
      <HUD
        score={score}
        level={level}
        xp={xp}
        xpToNext={xpToNext}
        time={time}
        isGameOver={isGameOver}
        onRestart={handleRestart}
        onBackToEditor={customMapData ? handleBackToEditor : undefined}
      />
      {import.meta.env.DEV && <DevConsole />}
    </>
  );
}

export default App;
