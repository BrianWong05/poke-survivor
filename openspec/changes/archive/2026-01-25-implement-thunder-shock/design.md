# Design

## Weapon: Thunder Shock
-   **Class**: `ThunderShock` implementation of `WeaponConfig`.
-   **Stats**:
    -   Cooldown: 1000ms
    -   Damage: 10 (Base)
    -   Speed: 400
-   **Targeting**: `scene.physics.closest(player, enemyGroup)`.
-   **Logic**:
    -   Instantiate `LightningBolt`.
    -   Set velocity towards target.
    -   Set rotation.

## Projectile: LightningBolt
-   **Class**: Extends `Phaser.Physics.Arcade.Sprite`.
-   **Visuals**: Small yellow circle (0xFFFF00).
-   **On Hit**:
    -   Damage enemy.
    -   20% chance to Stun (velocity 0 for 0.5s).
    -   Destroy self.

## Evolution: Thunderbolt
-   **Trigger**: Level >= 8.
-   **Effect**: Fire 2 projectiles OR Increase damage to 20.
-   **Decision**: Will implement "Fire 2 projectiles at once" simply by repeating the fire logic or slightly offsetting them.

## Integration
-   We need to ensure `LightningBolt` is added to the valid physics groups for collision.
-   `MainScene` exposes `projectilesGroup` via registry.
-   `ThunderShock` will retrieve `projectilesGroup`.
-   Since `projectilesGroup` is a pool of generic sprites, we have two options:
    1.  Use `get()` and cast/configure it (current `MainScene` behavior).
    2.  `add()` our custom `LightningBolt` instance.
    -   **Decision**: To strictly follow "Create a `Phaser.Physics.Arcade.Sprite` subclass", we must instantiate `LightningBolt`. Therefore we cannot easily use the existing generic pool without modifying the pool class type.
    -   **Approach**: `ThunderShock` will `new LightningBolt(scene, x, y)`. Then `scene.add.existing(bolt)` and `projectilesGroup.add(bolt)`.
    -   *Risk*: Pooling allows better performance. Creating new sprites every second is fine for prototype but bad for bullet hell.
    -   *Mitigation*: We will implement `LightningBolt` but stick to `new` for now as per "generate the code for... subclass" request strictly.
