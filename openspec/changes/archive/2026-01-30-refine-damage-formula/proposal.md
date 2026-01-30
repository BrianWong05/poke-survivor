# Proposal: Refine Damage Calculation

This change updates the `Player` damage calculation logic to address the issue where Defense is ineffective against low-damage, high-frequency attacks.

## Why
Currently, damage is calculated as `Math.max(1, amount - defense)`. This forces a minimum of 1 damage per hit.
For enemies dealing 1 damage (like Rattata, Bat), Defense values of 1 or higher have **no effect**, as `1 - 1 = 0` which is clamped back to `1`.
This makes the "Iron" item and Defense stat misleading and ineffective in the early game.

## What Changes
- Update the damage formula in `src/game/entities/Player.ts`.
- **New Formula:**
    - `mitigationFactor = 1 / (1 + (this.defense * 0.1))`
    - `finalDamage = amount * mitigationFactor`
- **Health Tracking:**
    - `Player.health` will now support decimal (float) values to accurately track chip damage.
    - `hp-update` events will emit `Math.ceil(this.health)` to ensure the UI displays clean integers.
- **Example:**
    - Incoming 1 Damage, Defense 10.
    - Factor: `1 / (1 + 1) = 0.5`.
    - Final Damage: `0.5`.
    - Health reduces by 0.5 (e.g., 100 -> 99.5).
    - UI shows 100 (ceil of 99.5).

## Verification Plan
1.  **Manual Verification**:
    - Set Player Defense to 10.
    - Get hit by Rattata (1 dmg).
    - Verify console logs show ~0.5 damage taken.
    - Verify UI HP bar updates smoothly (only drops visually after cumulative hits).
