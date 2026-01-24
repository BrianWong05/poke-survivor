# Change: Add Modular Character System with 6 Playable Pokémon

## Why
The current prototype has a single hard-coded Pikachu character. To support diverse gameplay and replayability, we need a modular architecture that allows easy addition of characters, each with unique Passives, Weapons (with Evolutions), and Ultimate abilities.

## What Changes
- **NEW** `CharacterConfig` interface defining stats, passives, weapons, and ultimates
- **NEW** `WeaponBase` class with cooldown-based auto-fire and evolution support
- **NEW** `PassiveBase` class for character-specific passive effects
- **NEW** `UltimateBase` class for manually-triggered abilities
- **NEW** Character registry with data-driven definitions for 6 characters
- **MODIFIED** `MainScene` to instantiate characters from registry instead of hard-coding
- **NEW** 6 character implementations: Pikachu, Charizard, Blastoise, Gengar, Lucario, Snorlax
- **NEW** Character selection UI component

> [!IMPORTANT]
> This is a major refactor of the player system. The existing Pikachu behavior will be preserved but extracted into the modular system.

## Impact
- **New specs**: `character-system`, `weapon-system`
- **Modified specs**: `game-core` (to reference character system)
- **Affected code**: 
  - `src/game/scenes/MainScene.ts` (player creation, weapon firing)
  - New files in `src/game/entities/` (characters, weapons, passives)
  - `src/components/` (character selection UI)

## Character Summary

| Character | Archetype | Passive | Weapon → Evolution | Ultimate |
|-----------|-----------|---------|-------------------|----------|
| Pikachu | Glass Cannon | Static (30% stun on touch) | Thunder Shock → Volt Tackle | Gigantamax Thunder |
| Charizard | Tank/Area | Blaze (+1% dmg per 1% HP missing) | Flamethrower → Blast Burn | Seismic Toss |
| Blastoise | Knockback Tank | Rain Dish (1 HP/5s regen) | Water Pulse → Hydro Cannon | Shell Smash |
| Gengar | Debuffer | Shadow Tag (aura pulls + 25% dmg) | Lick → Dream Eater | Destiny Bond |
| Lucario | Precision Crit | Inner Focus (+20% proj size, stun immune) | Aura Sphere → Focus Blast | Bone Rush |
| Snorlax | AFK Tank | Thick Fat (-50% Fire/Ice dmg) | Body Slam → Giga Impact | Rest |
