import { useState, useCallback } from 'react';
import { HashRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { GameCanvas } from '@/components/GameCanvas';
import { HUD } from '@/components/HUD';
import { CharacterSelect } from '@/components/CharacterSelect';
import { DevConsole } from '@/features/DevConsole';
import { LevelEditor } from '@/components/LevelEditor';
import type { CustomMapData } from '@/game/types/map';

function GamePage() {
  const { characterId } = useParams<{ characterId: string }>();
  const navigate = useNavigate();

  const location = useLocation();
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [xp, setXP] = useState(0);
  const [xpToNext, setXPToNext] = useState(100);
  const [time, setTime] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameKey] = useState(0);
  const [customMapData] = useState<CustomMapData | undefined>(location.state?.customMapData);

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

  const handleRestart = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleBackToEditor = useCallback(() => {
    navigate('/editor', { state: { customMapData } });
  }, [navigate, customMapData]);

  if (!characterId) {
    navigate('/');
    return null;
  }

  return (
    <>
      <GameCanvas
        key={gameKey}
        selectedCharacter={characterId}
        startInLevelEditor={false}
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

function CharacterSelectPage() {
  const navigate = useNavigate();

  const handleCharacterSelect = useCallback((characterId: string) => {
    navigate(`/game/${characterId}`);
  }, [navigate]);

  const handleOpenLevelEditor = useCallback(() => {
    navigate('/editor');
  }, [navigate]);

  return (
    <CharacterSelect
      onSelect={handleCharacterSelect}
      onOpenLevelEditor={import.meta.env.DEV ? handleOpenLevelEditor : undefined}
    />
  );
}

function LevelEditorPage() {
  const navigate = useNavigate();

  const location = useLocation();
  const initialData = location.state?.customMapData;

  const handlePlay = useCallback((_data: CustomMapData) => {
    // For now, navigate to game with default character
    // In future, could pass map data via state or context
    navigate('/game/pikachu', { state: { customMapData: _data } });
  }, [navigate]);

  const handleExit = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <LevelEditor
      onPlay={handlePlay}
      onExit={handleExit}
      initialData={initialData}
    />
  );
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<CharacterSelectPage />} />
        <Route path="/game/:characterId" element={<GamePage />} />
        <Route path="/editor" element={<LevelEditorPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
