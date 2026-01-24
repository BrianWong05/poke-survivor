import { useState, useEffect } from 'react';
import './styles.css';

interface XPUpdateEvent {
  current: number;
  max: number;
  level: number;
}

interface LevelBarProps {
  /** Initial XP values (optional, will be updated by events) */
  initialXP?: number;
  initialMax?: number;
  initialLevel?: number;
}

/**
 * LevelBar component that displays XP progress and current level.
 * Listens for 'xp-update' custom events from the Phaser game.
 */
export const LevelBar = ({
  initialXP = 0,
  initialMax = 25,
  initialLevel = 1,
}: LevelBarProps) => {
  const [currentXP, setCurrentXP] = useState(initialXP);
  const [maxXP, setMaxXP] = useState(initialMax);
  const [level, setLevel] = useState(initialLevel);

  useEffect(() => {
    const handleXPUpdate = (event: CustomEvent<XPUpdateEvent>) => {
      const { current, max, level: newLevel } = event.detail;
      setCurrentXP(current);
      setMaxXP(max);
      setLevel(newLevel);
    };

    // Listen for custom xp-update events from window
    window.addEventListener('xp-update', handleXPUpdate as EventListener);

    return () => {
      window.removeEventListener('xp-update', handleXPUpdate as EventListener);
    };
  }, []);

  const progressPercent = maxXP > 0 ? Math.min((currentXP / maxXP) * 100, 100) : 0;

  return (
    <div className="level-bar-container">
      <div className="level-badge">
        <span className="level-text">LVL {level}</span>
      </div>
      <div className="xp-bar-wrapper">
        <div className="xp-bar-background">
          <div
            className="xp-bar-progress"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="xp-text">
          {currentXP} / {maxXP}
        </span>
      </div>
    </div>
  );
};

export default LevelBar;
