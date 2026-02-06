## Context

The `LevelEditor` component currently conflates single-tile placement and recursive/smart placement (Autotiles) under a single "Brush" tool. This limits precision. We are splitting this functionality into two distinct tools: "Brush" (simple, single-tile) and "Fill" (recursive, smart).

## Goals / Non-Goals

**Goals:**
- implement a dedicated "Fill" tool that inherits the existing recursive/autoset logic.
- Implement a dedicated "Brush" tool that strictly places single tiles without recursion.
- Update the UI to allow selecting either tool.

**Non-Goals:**
- Changing the underlying Autotile algorithm (just restricting *when* it is called).
- Major refactoring of the `LevelEditor` component structure.

## Decisions

### 1. State Update
We will update the `activeTool` state definition in `LevelEditor` to include `'fill'`.
- **Current**: `type Tool = 'brush' | 'eraser' | 'spawn'`
- **New**: `type Tool = 'brush' | 'fill' | 'eraser' | 'spawn'`

### 2. Logic Migration
- The existing logic that triggers recursive updates (e.g., `updateAutoTileGrid` calls that affect neighbors recursively) will be moved to execute only when `activeTool === 'fill'`.
- The `activeTool === 'brush'` condition will be updated to only perform a simple `setTile` operation at the target coordinate, explicitly bypassing recursive updates even if the tile is an autotile.

### 3. UI Representation
- "Brush" button will remain but now activates the simple brush logic.
- New "Fill" button will be added (Icon: 🪣) to activate the recursive logic.

## Risks / Trade-offs

- **Risk**: Users accustomed to "Brush" handling autotiles automatically might be confused.
- **Mitigation**: Clear UI distinction. The "Fill" tool will effectively be the "Autotile Brush".

- **Risk**: Code duplication in mouse handlers.
- **Mitigation**: Both tools share the core "place tile" logic; the divergence is only in the *post-placement* update step (recursive vs single).
