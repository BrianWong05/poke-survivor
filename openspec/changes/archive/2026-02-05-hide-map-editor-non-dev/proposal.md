## Why

The Map Editor is a tool intended for developers and level designers to create and test new maps. Currently, the "Level Editor" button is visible to all users on the character selection screen. In production builds, this tool should be hidden to prevent unintended access by players and to maintain a clean user interface, consistent with how the Developer Console is handled.

## What Changes

The visibility of the "Level Editor" button in the character selection screen will be restricted to development environments using the `import.meta.env.DEV` flag. This change will be implemented in `App.tsx`, which controls the props passed to the `CharacterSelect` component.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `environment-gating`: Restriction of tool access to development environments will now include the Level Editor.

## Impact

- **Affected Code**: `src/App.tsx`.
- **User Interface**: The "Level Editor" button will be removed from the character selection screen in production builds.
- **Consistency**: Levels of access will be consistent with other developer-only tools like the `DevConsole`.
