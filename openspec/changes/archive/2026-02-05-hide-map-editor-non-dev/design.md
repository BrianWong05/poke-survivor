## Context

The Map Editor is currently accessible via a "Level Editor" button on the `CharacterSelect` screen. This button is rendered whenever the `onOpenLevelEditor` prop is provided to `CharacterSelect`.

## Goals / Non-Goals

**Goals:**
- Hide the "Level Editor" button in production environments.
- Ensure the Map Editor cannot be accessed accidentally in production.

**Non-Goals:**
- Remove the Map Editor code from the bundle (just hiding the entry point is sufficient for now).
- Change how the Map Editor works internally.

## Decisions

- **Conditional Prop Passing**: In `App.tsx`, the `handleOpenLevelEditor` callback will only be passed to the `CharacterSelect` component if `import.meta.env.DEV` is true.
- **Rationale**: `CharacterSelect` already has a conditional check: `{onOpenLevelEditor && <button ...>}`. By simply passing `undefined` in production, we leverage existing UI logic without modifying multiple components.
- **Environment Flag**: `import.meta.env.DEV` is the standard Vite environment flag already used in the project for the `DevConsole`.

## Risks / Trade-offs

- **Risk**: Security through obscurity. A sophisticated user could still potentially trigger the state change if they can access React DevTools or modify application state. However, for this project, hiding the UI element is the primary requirement.
