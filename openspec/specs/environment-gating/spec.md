# environment-gating Specification

## Purpose
Defines constraints and visibility rules for developer tools and experimental features based on the application's build environment.

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

---

### Requirement: LEVEL_EDITOR_PRODUCTION_VISIBILITY_RESTRICTION
The Level Editor access point MUST NOT be visible or interactive in production builds.

#### Scenario: Building for Production
- **Given** the application is built using `npm run build` (MODE=production)
- **Then** the `import.meta.env.DEV` flag evaluates to `false`
- **And** the "Level Editor" button SHALL NOT be rendered in the `CharacterSelect` screen

#### Scenario: Running in Development
- **Given** the application is running in a development environment (`npm run dev`)
- **Then** the `import.meta.env.DEV` flag evaluates to `true`
- **And** the "Level Editor" button SHALL be rendered and functional in the `CharacterSelect` screen

