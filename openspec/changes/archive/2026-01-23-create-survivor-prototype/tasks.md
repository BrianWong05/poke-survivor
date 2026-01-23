# Tasks: Create Survivor-like Game Prototype

## 1. Project Setup
- [x] 1.1 Initialize Vite + React + TypeScript project
- [x] 1.2 Install dependencies (phaser, nipplejs, @types/nipplejs)
- [x] 1.3 Configure `vite.config.ts` with absolute import aliases (`@/`)
- [x] 1.4 Configure `tsconfig.json` paths for `@/` alias
- [x] 1.5 Create base folder structure (`src/game/`, `src/components/`)

## 2. Phaser Integration
- [x] 2.1 Create Phaser game configuration file (`src/game/config.ts`)
- [x] 2.2 Create `GameCanvas` React component with Phaser initialization in `useEffect`
- [x] 2.3 Implement proper cleanup (game.destroy) on component unmount
- [x] 2.4 Create empty `MainScene` as placeholder

## 3. Placeholder Graphics Generation
- [x] 3.1 Generate player texture (blue circle) using Phaser Graphics
- [x] 3.2 Generate enemy texture (red square) using Phaser Graphics
- [x] 3.3 Generate projectile texture (white circle) using Phaser Graphics
- [x] 3.4 Generate XP gem texture (yellow diamond) using Phaser Graphics

## 4. Player Implementation
- [x] 4.1 Create Player sprite with physics body
- [x] 4.2 Implement keyboard input (WASD/Arrow keys) for movement
- [x] 4.3 Integrate nipplejs virtual joystick for mobile touch input
- [x] 4.4 Handle dual input: keyboard overrides joystick if both present

## 5. Enemy System
- [x] 5.1 Create Enemy Group with object pooling
- [x] 5.2 Implement spawn logic (random edge of screen)
- [x] 5.3 Implement enemy AI (move toward player)
- [x] 5.4 Set up continuous spawn timer (configurable rate)

## 6. Combat System
- [x] 6.1 Create Projectile Group with object pooling
- [x] 6.2 Implement auto-fire targeting (nearest enemy every 1 second)
- [x] 6.3 Set up projectile-enemy collision (destroy both)
- [x] 6.4 Set up player-enemy collision (damage player)

## 7. XP Economy
- [x] 7.1 Create XP Gem Group with object pooling
- [x] 7.2 Spawn XP gem when enemy is destroyed
- [x] 7.3 Implement XP gem collection (player overlap)
- [x] 7.4 Emit score update event to React

## 8. React UI Overlay (HUD)
- [x] 8.1 Create HUD component with HP bar and Score display
- [x] 8.2 Style HUD as transparent overlay positioned above canvas
- [x] 8.3 Wire up Phaser event emitter to React state (onScoreUpdate, onHPUpdate)
- [x] 8.4 Display game over state when HP reaches 0

## 9. Integration & Polish
- [x] 9.1 Integrate all components in `App.tsx`
- [x] 9.2 Test keyboard controls on desktop
- [x] 9.3 Test touch joystick on mobile (or emulated)
- [x] 9.4 Verify 60fps with 50+ enemies on screen
- [x] 9.5 Final code cleanup and documentation
