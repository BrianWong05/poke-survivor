# localization Specification

## Purpose
TBD - created by archiving change add-i18n-support. Update Purpose after archive.
## Requirements
### Requirement: Language Support
The application MUST support English ('en') and Traditional Chinese ('zh-TW') locales.
#### Scenario: Default Language
Given a user with a browser set to English
When they open the game
Then the text should be displayed in English.
#### Scenario: Language Detection
Given a user with a browser set to Traditional Chinese (Taiwan)
When they open the game
Then the text should be displayed in Traditional Chinese.

### Requirement: Language Switching
The user MUST be able to manually switch between supported languages.
#### Scenario: Switch to Chinese
Given the user is viewing the game in English
When they click the "Traditional Chinese" toggle button
Then the UI text updates to Chinese immediately.

### Requirement: Data Localization
Static game data (tables, names, descriptions) MUST be localizable via translation keys.
#### Scenario: Dex Data
Given the Dex View
When the language is set to Chinese
Then the Pokemon names and descriptions (e.g., "Pikachu") receive their Chinese translations (e.g., "皮卡丘").

### Requirement: UI Localization
Static UI elements (menus, buttons, HUD) MUST be localizable.
#### Scenario: Main Menu
Given the Main Menu
When the language is changed
Then the button labels ("Start Game", "Settings") update to the target language.

