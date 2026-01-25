# dex_ui Specification

## Purpose
TBD - created by archiving change add-dex-feature. Update Purpose after archive.
## Requirements
### Requirement: Tabs Navigation
The Dex screen MUST provide tabs to filter items.

#### Scenario: Switching tabs
Given I am on the Dex screen
When I click "Bestiary"
Then I should see a grid of enemy cards.

### Requirement: Card Visualization
The Dex grid MUST visualize items based on their status.

#### Scenario: Viewing unlocked item
Given 'pikachu' is unlocked
When I view the Pokemon tab
Then I should see the full 'pikachu' sprite and name.

#### Scenario: Viewing seen item
Given 'rattata' is seen but not unlocked
When I view the Bestiary tab
Then I should see a grey 'rattata' sprite and "???" as the name.

#### Scenario: Viewing unknown item
Given 'mewtwo' is not seen
When I view the Pokemon tab
Then I should see a locked icon.

### Requirement: Detail View
The Dex screen MUST show details for unlocked items.

#### Scenario: Opening details
Given 'pikachu' is unlocked
When I click on the 'pikachu' card
Then a modal should open showing its Base HP, Description, and Evolution chain.

