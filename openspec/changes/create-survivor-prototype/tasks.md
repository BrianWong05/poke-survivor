# Tasks: Create Survivor-like Game Prototype

## 1. Project Setup
- [ ] 1.1 Initialize Vite + React + TypeScript project
- [ ] 1.2 Install dependencies (phaser, nipplejs, @types/nipplejs)
- [ ] 1.3 Configure `vite.config.ts` with absolute import aliases (`@/`)
- [ ] 1.4 Configure `tsconfig.json` paths for `@/` alias
- [ ] 1.5 Create base folder structure (`src/game/`, `src/components/`)

## 2. Phaser Integration
- [ ] 2.1 Create Phaser game configuration file (`src/game/config.ts`)
- [ ] 2.2 Create `GameCanvas` React component with Phaser initialization in `useEffect`
- [ ] 2.3 Implement proper cleanup (game.destroy) on component unmount
- [ ] 2.4 Create empty `MainScene` as placeholder

## 3. Placeholder Graphics Generation
- [ ] 3.1 Generate player texture (blue circle) using Phaser Graphics
- [ ] 3.2 Generate enemy texture (red square) using Phaser Graphics
- [ ] 3.3 Generate projectile texture (white circle) using Phaser Graphics
- [ ] 3.4 Generate XP gem texture (yellow diamond) using Phaser Graphics

## 4. Player Implementation
- [ ] 4.1 Create Player sprite with physics body
- [ ] 4.2 Implement keyboard input (WASD/Arrow keys) for movement
- [ ] 4.3 Integrate nipplejs virtual joystick for mobile touch input
- [ ] 4.4 Handle dual input: keyboard overrides joystick if both present

## 5. Enemy System
- [ ] 5.1 Create Enemy Group with object pooling
- [ ] 5.2 Implement spawn logic (random edge of screen)
- [ ] 5.3 Implement enemy AI (move toward player)
- [ ] 5.4 Set up continuous spawn timer (configurable rate)

## 6. Combat System
- [ ] 6.1 Create Projectile Group with object pooling
- [ ] 6.2 Implement auto-fire targeting (nearest enemy every 1 second)
- [ ] 6.3 Set up projectile-enemy collision (destroy both)
- [ ] 6.4 Set up player-enemy collision (damage player)

## 7. XP Economy
- [ ] 7.1 Create XP Gem Group with object pooling
- [ ] 7.2 Spawn XP gem when enemy is destroyed
- [ ] 7.3 Implement XP gem collection (player overlap)
- [ ] 7.4 Emit score update event to React

## 8. React UI Overlay (HUD)
- [ ] 8.1 Create HUD component with HP bar and Score display
- [ ] 8.2 Style HUD as transparent overlay positioned above canvas
- [ ] 8.3 Wire up Phaser event emitter to React state (onScoreUpdate, onHPUpdate)
- [ ] 8.4 Display game over state when HP reaches 0

## 9. Integration & Polish
- [ ] 9.1 Integrate all components in `App.tsx`
- [ ] 9.2 Test keyboard controls on desktop
- [ ] 9.3 Test touch joystick on mobile (or emulated)
- [ ] 9.4 Verify 60fps with 50+ enemies on screen
- [ ] 9.5 Final code cleanup and documentation

## Dependencies
- Tasks 3.x must complete before 4.1, 5.1, 6.1, 7.1 (textures needed for sprites)
- Tasks 4.x must complete before 6.x (player needed for targeting)
- Tasks 5.x must complete before 6.x and 7.x (enemies needed for combat)
- Tasks 2.x must complete before all other game tasks

## Parallelizable Work
- Task 8.x (React HUD) can proceed in parallel with Tasks 4-7 (game logic)
- Tasks 3.1-3.4 can all be done together
