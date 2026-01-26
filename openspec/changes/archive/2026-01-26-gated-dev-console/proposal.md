# Proposal: Gated Dev Console

Refactor the Developer Console to ensure it is only rendered and interactive in development environments, preventing players from accessing debug features in production builds.

## Why
The Developer Console provides powerful cheats and debugging tools (level manipulation, invincibility, etc.) that must not be accessible to end-users in a production environment. Leaving these active would compromise game integrity and potentially expose internal logic.

## What Changes
- **Runtime Gating**: Internal check in `DevConsole.tsx` to return `null` and skip event listeners if not in dev mode.
- **Bundle Optimization (Tree Shaking)**: Conditional rendering in the parent component (`App.tsx`) to allow Vite's build process to prune the `DevConsole` code from production bundles.
- **Environment Targeting**: Standardization on Vite's `import.meta.env.DEV` flag.
