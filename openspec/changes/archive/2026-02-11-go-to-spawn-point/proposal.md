# Proposal: Go to Spawn Point

## Why
Users need a quick way to navigate back to the spawn point in the level editor, especially on large maps. Double-clicking the "Spawn" tool is a logical and intuitive shortcut for this action.

## What Changes
- Add a double-click handler to the Spawn tool in the editor sidebar.
- Implement logic in the Level Editor to scroll the viewport so the current spawn point is centered.

## Capabilities

### New Capabilities
- `navigate-to-spawn`: Ability to instantly jump to the spawn point in the level editor.

## Impact
- `EditorSidebar`: New prop for double-click events.
- `LevelEditor`: New logic for viewport management and centering.
