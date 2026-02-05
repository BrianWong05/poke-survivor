## ADDED Requirements

### Requirement: routing-infrastructure
The application shall use `react-router-dom`'s `HashRouter` for client-side routing.

#### Scenario: hash-based-navigation
- **WHEN** the user navigates to `/#/editor`
- **THEN** the Level Editor component shall be rendered.

#### Scenario: base-url-configuration
- **WHEN** the application is built and deployed
- **THEN** the base URL shall be `/poke-survivor/`.

### Requirement: navigation-flow
The application shall handle transitions between character selection, gameplay, and the level editor via routes.

#### Scenario: game-start-navigation
- **WHEN** a character is selected on the Home page
- **THEN** the application shall navigate to `/game/:characterId`.
