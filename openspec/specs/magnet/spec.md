# magnet Specification

## Purpose
The Magnet item provides an utility effect by increasing the player's pickup range (collection radius).

## Requirements

### Requirement: Magnet Item Scaling
The Magnet item SHALL increase the player's pickup range based on its level.
- **Base bonus**: +30% (+0.30 multiplier) per level.
- **Max Level**: 5 (Total +150% or 2.5x base radius).

#### Scenario: Acquiring Magnet Level 1
- **WHEN** the player acquires Magnet Level 1
- **THEN** the player's `magnetRadius` increases by 30% from the base value.

#### Scenario: Reaching Max Level
- **WHEN** the player upgrades Magnet to Level 5
- **THEN** the player's `magnetRadius` increases by a total of 150% (2.5x base).

### Requirement: Magnet Visuals
The Magnet item SHALL use the designated sprite from the PokeAPI source.
- **Sprite Key**: `magnet`
- **Source URL**: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/magnet.png`
- **Local Path**: `public/assets/items/magnet.png`

#### Scenario: Loading the Asset
- **WHEN** the game starts (Preloader scene)
- **THEN** the `magnet` image is loaded from `assets/items/magnet.png`.
