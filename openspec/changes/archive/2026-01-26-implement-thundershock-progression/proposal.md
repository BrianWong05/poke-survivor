# Proposal: Implement ThunderShock Progression

## Summary
Refactor `ThunderShock` to implement a Level 1-8 upgrade progression, replacing the current projectile behavior with an instant chain-lightning mechanic using `Phaser.GameObjects.Graphics` for visuals.

## Motivation
To support the "ThunderShock" upgrade path (Levels 1-8) as requested, enabling distinct power spikes (Damage, Bounces, Range, Cooldown) and verifying the efficiency of the chain logic at high fire rates (Level 8).

## Capabilities
- **Level-Based Stats**: Dynamic stats retrieval based on weapon level.
- **Instant Chain Logic**: `fire()` method executes an immediate chain-hit algorithm across multiple targets.
- **Visuals**: Lightning bolts drawn using Graphics that fade out quickly.

## Requirements Checklist
- [ ] Level 1-8 stats implemented correctly.
- [ ] Evolution disabled for now.
- [ ] Chaining logic hits closest enemies without re-hitting.
- [ ] Visuals (Yellow/Light Blue lines) fade out in 100ms.
- [ ] Performance optimized for rapid fire at Level 8.
