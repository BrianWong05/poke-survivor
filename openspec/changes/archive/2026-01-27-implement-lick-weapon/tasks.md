# Tasks: Implement Lick Weapon

- [x] Scaffold Files <!-- id: 0 -->
    - [x] Create `src/game/entities/weapons/hitboxes/LickHitbox.ts` <!-- id: 1 -->
    - [x] Create `src/game/entities/weapons/specific/Lick.ts` <!-- id: 2 -->
- [x] Implement `LickHitbox` <!-- id: 3 -->
    - [x] Setup Physics/Graphics (Pink Rectangle) <!-- id: 4 -->
    - [x] Implement `onEntityHit` with Damage & No Knockback <!-- id: 5 -->
    - [x] Implement Paralysis Logic (random chance, 0-vector knockback) <!-- id: 6 -->
    - [x] Implement lifecycle (150ms duration) <!-- id: 7 -->
- [x] Implement `Lick` Weapon Config <!-- id: 8 -->
    - [x] Implement `getStats` progression (Lvl 1-8) <!-- id: 9 -->
    - [x] Implement `fire` logic (Directional check, count check) <!-- id: 10 -->
- [x] Integration <!-- id: 11 -->
    - [x] Register weapon in `WeaponRegistry` (if applicable) or verify loading <!-- id: 12 -->
    - [x] Verify UI Name "Lick (舌舔)" <!-- id: 13 -->
- [x] Verification <!-- id: 14 -->
    - [x] Manual Playtest <!-- id: 15 -->
