# Design: Environment Gating for Dev Tools

## Strategy

We will implement a two-layered defense to ensure the Dev Console is absent from production:

### 1. The Parent Gate (Tree Shaking)
In `App.tsx`, we will wrap the `DevConsole` component call with a conditional:
```tsx
{import.meta.env.DEV && <DevConsole />}
```
**Reasoning**: Modern bundlers (like Vite/Rollup) perform "Dead Code Elimination" (DCE). Since `import.meta.env.DEV` is replaced with a literal `false` during the production build, the compiler sees `{false && <DevConsole />}`. This allows the bundler to completely omit the `DevConsole` component and all its unique dependencies (like specific weapon classes imported only there) from the final production `.js` files.

### 2. The Internal Gate (Runtime Safety)
Inside `DevConsole.tsx`, we will add guards at the top of the component and its effects:
```tsx
if (!import.meta.env.DEV) return null;
```
**Reasoning**: This acts as a "belt and suspenders" approach. If for some reason the component is imported or rendered (e.g., during a misconfigured test build or a different parent integration), it will still remain inert.

## Environment Flags
We will use `import.meta.env.DEV` as it is the standard Vite idiom for "true during `npm run dev` or `vite`, false during building for production".
