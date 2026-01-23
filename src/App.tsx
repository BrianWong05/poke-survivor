import { useState, useCallback } from 'react';
import { GameCanvas } from '@/components/GameCanvas';
import { HUD } from '@/components/HUD';

const MAX_HP = 100;

function App() {
  const [score, setScore] = useState(0);
  const [hp, setHP] = useState(MAX_HP);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);

  const handleHPUpdate = useCallback((newHP: number) => {
    setHP(newHP);
  }, []);

  const handleGameOver = useCallback(() => {
    setIsGameOver(true);
  }, []);

  const handleRestart = useCallback(() => {
    setScore(0);
    setHP(MAX_HP);
    setIsGameOver(false);
    setGameKey(prev => prev + 1);
  }, []);

  return (
    <>
      <GameCanvas
        key={gameKey}
        onScoreUpdate={handleScoreUpdate}
        onHPUpdate={handleHPUpdate}
        onGameOver={handleGameOver}
      />
      <HUD
        score={score}
        hp={hp}
        maxHP={MAX_HP}
        isGameOver={isGameOver}
        onRestart={handleRestart}
      />
    </>
  );
}

export default App;
