import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import nipplejs from 'nipplejs';
import type { JoystickManager } from 'nipplejs';
import { createGameConfig, type GameCallbacks } from '@/game/config';
import { MainScene } from '@/game/scenes/MainScene';
import { getCharacter } from '@/game/entities/characters/registry';
import './styles.css';

interface GameCanvasProps {
  selectedCharacter: string;
  onScoreUpdate: (score: number) => void;
  onHPUpdate: (hp: number) => void;
  onLevelUpdate: (level: number, xp: number, xpToNext: number) => void;
  onGameOver: () => void;
  onQuit: () => void;
  onMaxHPChange: (maxHP: number) => void;
}

export const GameCanvas = ({
  selectedCharacter,
  onScoreUpdate,
  onHPUpdate,
  onLevelUpdate,
  onGameOver,
  onQuit,
  onMaxHPChange,
}: GameCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const joystickRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const joystickManagerRef = useRef<JoystickManager | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Get character config for max HP
    const characterConfig = getCharacter(selectedCharacter);
    onMaxHPChange(characterConfig.stats.maxHP);

    const callbacks: GameCallbacks = {
      onScoreUpdate,
      onHPUpdate,
      onGameOver,
      onQuit,
      onLevelUpdate,
    };

    // Create Phaser game
    const config = createGameConfig(containerRef.current, callbacks);
    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Store selected character in registry for MainScene to access
    game.registry.set('selectedCharacter', selectedCharacter);

    // Setup nipplejs for touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice && joystickRef.current) {
      const manager = nipplejs.create({
        zone: joystickRef.current,
        mode: 'static',
        position: { left: '80px', bottom: '80px' },
        color: 'rgba(255, 255, 255, 0.5)',
        size: 120,
      });

      manager.on('move', (_evt, data) => {
        const scene = game.scene.getScene('MainScene') as MainScene;
        if (scene && data.vector) {
          scene.setJoystickVector(data.vector.x, -data.vector.y);
        }
      });

      manager.on('end', () => {
        const scene = game.scene.getScene('MainScene') as MainScene;
        if (scene) {
          scene.setJoystickVector(0, 0);
        }
      });

      joystickManagerRef.current = manager;
    }

    // Cleanup
    return () => {
      if (joystickManagerRef.current) {
        joystickManagerRef.current.destroy();
        joystickManagerRef.current = null;
      }
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [selectedCharacter, onScoreUpdate, onHPUpdate, onGameOver, onQuit, onLevelUpdate, onMaxHPChange]);

  return (
    <div className="game-container">
      <div ref={containerRef} className="phaser-container" />
      <div ref={joystickRef} className="joystick-zone" />
    </div>
  );
};
