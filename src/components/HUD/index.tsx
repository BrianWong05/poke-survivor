import './styles.css';

interface HUDProps {
  score: number;
  hp: number;
  maxHP: number;
  isGameOver: boolean;
  onRestart: () => void;
}

export const HUD = ({ score, hp, maxHP, isGameOver, onRestart }: HUDProps) => {
  const hpPercent = Math.max(0, (hp / maxHP) * 100);

  return (
    <div className="hud-overlay">
      <div className="hud-top">
        <div className="hp-container">
          <div className="hp-label">HP</div>
          <div className="hp-bar-bg">
            <div
              className="hp-bar-fill"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
          <div className="hp-text">{hp}/{maxHP}</div>
        </div>
        <div className="score-container">
          <div className="score-label">SCORE</div>
          <div className="score-value">{score}</div>
        </div>
      </div>

      {isGameOver && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h1 className="game-over-title">GAME OVER</h1>
            <p className="final-score">Final Score: {score}</p>
            <button className="restart-btn" onClick={onRestart}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
