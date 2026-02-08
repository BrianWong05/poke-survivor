import { LevelBar } from '@/components/HUD/LevelBar';

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
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50">
      <div
        className="flex justify-between items-start"
        style={{ padding: '20px', gap: '20px' }}
      >
        <LevelBar initialXP={xp} initialMax={xpToNext} initialLevel={level} />

        <div
          className="absolute left-1/2 -translate-x-1/2 text-white font-bold [text-shadow:2px_2px_0_#000]"
          style={{ top: '20px', fontSize: '32px' }}
        >
          {formatTime(time)}
        </div>

        {onBackToEditor && (
          <div
            className="flex absolute left-1/2 -translate-x-1/2 items-center pointer-events-auto z-[100]"
            style={{ bottom: '20px' }}
          >
            <button
              className="bg-[rgba(46,204,113,0.2)] border border-white/20 rounded-[12px] text-white font-semibold cursor-pointer backdrop-blur-[12px] backdrop-saturate-[1.8] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] whitespace-nowrap shadow-[0_4px_16px_rgba(0,0,0,0.2)] flex items-center hover:bg-[rgba(46,204,113,0.4)] hover:-translate-y-[2px] hover:scale-[1.02] hover:border-white/40 hover:shadow-[0_8px_24px_rgba(46,204,113,0.3)] active:translate-y-0 active:scale-[0.98]"
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                gap: '8px',
              }}
              onClick={onBackToEditor}
            >
              ⬅ Back to Editor
            </button>
          </div>
        )}

        <div
          className="flex items-center bg-black/60 rounded-[8px] backdrop-blur-[4px]"
          style={{ padding: '10px 15px', gap: '10px' }}
        >
          <div
            className="font-bold text-[#ffd700] [text-shadow:1px_1px_2px_rgba(0,0,0,0.8)]"
            style={{ fontSize: '14px' }}
          >
            SCORE
          </div>
          <div
            className="font-bold text-white [text-shadow:1px_1px_2px_rgba(0,0,0,0.8)]"
            style={{ fontSize: '20px', minWidth: '80px' }}
          >
            {score}
          </div>
        </div>
      </div>

      <div className="absolute" style={{ bottom: '20px', right: '20px' }}>
        <div
          className="bg-black/60 rounded-[6px] text-[#aaa] backdrop-blur-[4px]"
          style={{ padding: '8px 12px', fontSize: '12px' }}
        >
          SPACE: Ultimate
        </div>
      </div>

      {isGameOver && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-[rgba(0,0,0,0.7)] pointer-events-auto">
          <div
            className="text-center bg-[rgba(20,20,40,0.95)] rounded-[16px] border-2 border-white/20 backdrop-blur-[8px]"
            style={{ padding: '40px' }}
          >
            <h1
              className="font-bold text-[#ff4a4a] [text-shadow:2px_2px_4px_rgba(0,0,0,0.8)]"
              style={{ fontSize: '48px', marginBottom: '20px' }}
            >
              GAME OVER
            </h1>
            <p
              className="text-[#ffd700]"
              style={{ fontSize: '24px', marginBottom: '10px' }}
            >
              Final Score: {score}
            </p>
            <p
              className="text-[#9b59b6]"
              style={{ fontSize: '18px', marginBottom: '30px' }}
            >
              Level Reached: {level}
            </p>
            <button
              className="font-bold text-white bg-[linear-gradient(135deg,#4a9eff,#2d7dd2)] border-none rounded-[8px] cursor-pointer transition-transform duration-200 hover:scale-[1.05] hover:shadow-[0_4px_20px_rgba(74,158,255,0.4)]"
              style={{ padding: '15px 40px', fontSize: '18px' }}
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
