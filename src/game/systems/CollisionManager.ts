import Phaser from 'phaser';
import { Player } from '@/game/entities/Player';
import { EnemySpawner } from '@/game/systems/EnemySpawner';

/**
 * CollisionManager handles the low-level physics collision and overlap setup.
 * It keeps the scene and CombatManager clean of boilerplate collision code.
 */
export class CollisionManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Sets up all combat-related collisions between entities.
   * 
   * @param config - Configuration object containing groups and players
   * @param handlers - Callbacks for different collision events
   */
  public setupCombatCollisions(
    config: {
      player: Player;
      enemySpawner: EnemySpawner;
      projectiles: Phaser.Physics.Arcade.Group;
      hazards: Phaser.Physics.Arcade.Group;
    },
    handlers: {
      onProjectileEnemy: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback;
      onPlayerEnemy: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback;
      onEnemyHazard: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback;
    }
  ): void {
    const { player, enemySpawner, projectiles, hazards } = config;
    
    const enemyPools = [
      enemySpawner.getRattataPool(),
      enemySpawner.getGeodudePool(),
      enemySpawner.getZubatPool(),
    ];

    enemyPools.forEach((pool) => {
      // 1. Projectile impacts Enemy
      this.scene.physics.add.overlap(
        projectiles,
        pool,
        handlers.onProjectileEnemy,
        undefined,
        this.scene
      );

      // 2. Enemy touches Player
      this.scene.physics.add.overlap(
        player,
        pool,
        handlers.onPlayerEnemy,
        undefined,
        this.scene
      );

      // 3. Enemy walks into Hazard
      this.scene.physics.add.overlap(
        pool,
        hazards,
        handlers.onEnemyHazard,
        undefined,
        this.scene
      );
    });
  }
}
