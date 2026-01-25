# Implement Lucario's Character Kit

## Summary
Implement the full character kit for Lucario, focusing on "Precision and Skill". This includes the Innate Weapon (Aura Sphere which evolves into Focus Blast), the Ultimate Ability (Bone Rush), a new Passive logic (Inner Focus), and core mechanics updates for Critical Hits and Instakills.

## Impact
- **New Gameplay Mechanics:** Critical Hits and Instakills add a new layer of RNG excitement.
- **New Character Playstyle:** Lucario offers a high-skill, aim-dependent playstyle (Focus Blast) mixed with automated damaging zones (Bone Rush).
- **Core System Updates:** `Enemy` and `Player` classes will be updated to support these new features.

## Risks
- **Balance:** Instakill mechanics might be too strong or too weak depending on proc rates.
- **Performance:** Orbiting projectiles and explosions could impact performance if object pooling isn't used correctly.
- **Complexity:** Adding crit/instakill logic to the base `Enemy` class adds complexity to the core entity.

## Alternatives Considered
- **Separate Crit System:** Could create a separate `DamageManager` instead of modifying `Enemy` directly, but modifying `Enemy` is simpler for the current prototype phase.
