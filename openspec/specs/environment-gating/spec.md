# environment-gating Specification

## Purpose
TBD - created by archiving change gated-dev-console. Update Purpose after archive.
## Requirements
### Requirement: PRODUCTION_VISIBILITY_RESTRICTION
The Developer Console MUST NOT be rendered or interactive in production builds.

#### Scenario: Building for Production
- **Given** the application is built using `npm run build` (MODE=production)
- **Then** the `import.meta.env.DEV` flag evaluates to `false`
- **And** the `DevConsole` component is excluded from the render tree

#### Scenario: Running in Production
- **Given** the application is running in a production environment
- **When** the user presses the Backtick (`) key
- **Then** no debug console overlay appears
- **And** no global keyboard listeners for debug keys are active

