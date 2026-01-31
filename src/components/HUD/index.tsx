import './styles.css';

interface HUDProps {
  score: number;
  level: number;
  xp: number;
  xpToNext: number;
  isGameOver: boolean;
  onRestart: () => void;
}

export const HUD = ({
  score,
  level,
  xp,
  xpToNext,
  isGameOver,
  onRestart,
}: HUDProps) => {
  const xpPercent = Math.max(0, (xp / xpToNext) * 100);

  return (
    <div className="hud-overlay">
      <div className="hud-top">
        <div className="level-container">
          <div className="level-label">LVL {level}</div>
          <div className="xp-bar-bg">
            <div
              className="xp-bar-fill"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <div className="xp-text">{xp}/{xpToNext} XP</div>
        </div>

        <div className="score-container">
          <div className="score-label">SCORE</div>
          <div className="score-value">{score}</div>
        </div>
      </div>

      <div className="hud-controls">
        <div className="control-hint">SPACE: Ultimate</div>
      </div>

      {isGameOver && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h1 className="game-over-title">GAME OVER</h1>
            <p className="final-score">Final Score: {score}</p>
            <p className="final-level">Level Reached: {level}</p>
            <button className="restart-btn" onClick={onRestart}>
              Select New Character
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

