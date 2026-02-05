## ADDED Requirements

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
