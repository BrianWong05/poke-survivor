import { useState, useEffect } from 'react';
import styles from './styles.module.css';

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
 * Refined design: No background on level badge, horizontal layout.
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
    <div className={styles.container}>
      {/* Level Text (No Background) */}
      <span className={styles.levelText}>
        LVL {level}
      </span>

      {/* Progress Group (Track + Text) */}
      <div className={styles.progressGroup}>
        {/* Progress Track */}
        <div className={styles.progressTrack}>
          {/* Progress Fill */}
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* XP Text (Right Side) */}
        <span className={styles.xpText}>
          {currentXP} / {maxXP}
        </span>
      </div>
    </div>
  );
};

export default LevelBar;
