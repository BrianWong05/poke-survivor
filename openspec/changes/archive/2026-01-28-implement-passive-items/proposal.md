# Implement Passive Items: HpUp, Leftovers, Iron

## Summary
Implement three core passive items (`HpUp`, `Leftovers`, `Iron`) that utilize the newly added Player stats (`maxHp`, `regen`, `defense`).

## Problem
Currently, the game lacks passive items that directly enhance survival stats.
The `Player` entity now supports these stats, but there are no items to exploit them.

## Solution
1.  **Create Base Classes**: Implement `Item` (abstract base) and `PassiveItem` (extends Item) to standardize item behavior.
2.  **Implement Items**:
    -   `HpUp`: Increases MaxHP per level. Heals logic on acquire.
    -   `Leftovers`: Grants HP Regeneration per level.
    -   `Iron`: Grants Defense (Damage Reduction).

## Risks
*   **Balancing**: Defense scaling needs to be careful to avoid invincibility (Iron adds +1 every 2 levels to mitigate).
*   **Architecture**: Introducing new Class-based item hierarchy (`Item` -> `PassiveItem` -> `HpUp`) vs existing Interface-based (`WeaponConfig`). This proposal assumes Class-based is preferred for stateful logic (onEquip/Upgrade).

## Alternatives Considered
*   **Config-only**: Using `PassiveConfig` (traits) pattern. Rejected because these are collectible items with levels and progression, fitting an `Item` class structure better than simple trait configs.
