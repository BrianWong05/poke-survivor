# Lucario Kit Design

## Core Mechanics: Crit & Instakill
- **Location:** `src/game/entities/enemies/Enemy.ts`
- **Method:** `takeDamage(amount: number, isCrit: boolean = false)`
- **Visuals:** Red "CRIT!" floating text.
- **Logic:**
    - Non-Boss: `isCrit` -> `hp = 0` (Instakill) or massive damage.
    - Boss: `isCrit` -> `damage * 2`.

## Weapons

### Aura Sphere (Level 1-7)
- **Class:** `AuraSphere` (Weapon), `AuraSphereProjectile` (Projectile)
- **Visual:** Blue Circle (`0x00BFFF`)
- **Behavior:**
    - Homing: Adjust velocity vector towards nearest enemy in `update()`.
    - Turn Rate: High.
    - Stats: Dmg 12, Pierce 2, Speed 400.

### Focus Blast (Level 8+)
- **Class:** `FocusBlastProjectile` (extends or separate)
- **Visual:** Orange/Red Sphere (`0xFF4500`), Scale 2.5.
- **Behavior:**
    - No Homing.
    - Slower Speed (200).
    - On Hit: Spawns `Explosion` object.
- **Explosion:**
    - AOE Hitbox.
    - 50% chance to pass `isCrit: true` to `takeDamage`.

### Bone Rush (Ultimate)
- **Class:** `BoneRush` (Weapon/Ability)
- **Trigger:** Auto-cast (20s cooldown, 8s duration).
- **Effect:**
    - Spawns 4 `BoneProjectile`s.
    - Orbit logic: `x = player.x + cos(t)*r`, `y = player.y + sin(t)*r`.
    - Radius oscillates: `100 + sin(t)*50`.
    - **Buff:** `Player.moveSpeedMultiplier = 1.5` during activation.

## Passive: Inner Focus
- **Location:** `src/game/entities/Player.ts`
- **Property:** `projectileSizeModifier` (default 1.0).
- **Logic:** If character is Lucario/Riolu, set to 1.2.
- **Usage:** All projectile weapons multiply their scale by this modifier.
