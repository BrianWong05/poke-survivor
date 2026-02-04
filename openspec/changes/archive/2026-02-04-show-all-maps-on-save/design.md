## Context

The current Level Editor uses `window.prompt` for saving maps. This is inconsistent with the rest of the application's UI and lacks context (e.g., existing map names). The `Load` functionality already uses a custom React modal, providing a precedent for custom UI.

## Goals / Non-Goals

**Goals:**
- Provide a consistent UI for saving maps.
- Show existing maps during the save process.
- Prevent accidental overwriting of maps without confirmation.

**Non-Goals:**
- Adding map folders or categorization.
- Changing the underlying map data format.
- Modifying the server-side API (except for potentially checking existence if needed, but client-side knowledge is sufficient for now).

## Decisions

- **Decision 1: Modularize Map Modals**: I will refactor the existing `LoadModal` logic into a more generic `MapModal` component or create a similar `SaveModal` to maintain consistency.
- **Decision 2: Overwrite Confirmation**: I will use a simple state-based confirmation within the modal or a standard `window.confirm` for the overwrite step initially, as it's safer than automatic overwriting.
- **Decision 3: Input Synergy**: Clicking an item in the "existing maps" list will populate the name input field in the Save Modal.

## Risks / Trade-offs

- [Risk] → **Map Name Duplication**: A user might try to save with a name that was deleted by another user in the meantime.
  - Mitigation: The server already handles file writing; we can add a simple "Are you sure?" if the client-side list contains the name.
- [Risk] → **UI Complexity**: Adding more modals can clutter the code if not managed well.
  - Mitigation: Keep the modal logic focused and potentially extract into sub-components as per user rules.
