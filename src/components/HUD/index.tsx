import { LevelBar } from '@/components/HUD/LevelBar';
import styles from './index.module.css';

interface HUDProps {
  score: number;
  level: number;
  xp: number;
  xpToNext: number;
  time: number;
  isGameOver: boolean;
  onRestart: () => void;
  onBackToEditor?: () => void;
}

export const HUD = ({
  score,
  level,
  xp,
  xpToNext,
  time,
  isGameOver,
  onRestart,
  onBackToEditor,
}: HUDProps) => {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <LevelBar initialXP={xp} initialMax={xpToNext} initialLevel={level} />

        <div className={styles.timer}>
          {formatTime(time)}
        </div>

        {onBackToEditor && (
          <div className={styles.backButtonContainer}>
            <button
              className={styles.backButton}
              onClick={onBackToEditor}
            >
              ⬅ Back to Editor
            </button>
          </div>
        )}

        <div className={styles.scoreContainer}>
          <div className={styles.scoreLabel}>
            SCORE
          </div>
          <div className={styles.scoreValue}>
            {score}
          </div>
        </div>
      </div>

      <div className={styles.controlsHint}>
        <div className={styles.hintBox}>
          SPACE: Ultimate
        </div>
      </div>

      {isGameOver && (
        <div className={styles.gameOverOverlay}>
          <div className={styles.gameOverBox}>
            <h1 className={styles.gameOverTitle}>
              GAME OVER
            </h1>
            <p className={styles.gameOverScore}>
              Final Score: {score}
            </p>
            <p className={styles.gameOverLevel}>
              Level Reached: {level}
            </p>
            <button
              className={styles.restartButton}
              onClick={onRestart}
            >
              Select New Character
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
