import { useState, useEffect } from 'react';

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
    <div
      className="flex items-center rounded-[8px] border border-white/10 backdrop-blur-[8px]"
      style={{
        background: 'rgba(10, 10, 20, 0.85)',
        padding: '8px 16px',
        width: 'auto',
        minWidth: '300px',
        gap: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Level Text (No Background) */}
      <span
        className="font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif] font-bold uppercase tracking-[0.5px]"
        style={{
          fontSize: '16px',
          color: '#FFD700', // Gold color for distinct visibility
          textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
          whiteSpace: 'nowrap',
        }}
      >
        LVL {level}
      </span>

      {/* Progress Group (Track + Text) */}
      <div className="flex-1 flex items-center" style={{ gap: '8px' }}>
        {/* Progress Track */}
        <div
          className="flex-1 rounded-full overflow-hidden"
          style={{
            height: '12px',
            background: 'rgba(0, 0, 0, 0.5)',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* Progress Fill */}
          <div
            className="h-full rounded-full transition-[width] duration-300 ease-out"
            style={{
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #4a9eff 0%, #6bb3ff 100%)',
              boxShadow: '0 0 8px rgba(74, 158, 255, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            }}
          />
        </div>

        {/* XP Text (Right Side) */}
        <span
          className="font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif] font-medium text-white/90 tracking-[0.5px]"
          style={{
            fontSize: '12px',
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
            whiteSpace: 'nowrap',
            minWidth: 'auto', // Reduced min-width to prevent extra spacing
            textAlign: 'right',
          }}
        >
          {currentXP} / {maxXP}
        </span>
      </div>
    </div>
  );
};

export default LevelBar;
