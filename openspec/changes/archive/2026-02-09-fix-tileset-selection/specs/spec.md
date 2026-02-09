# Specs: Fix Tileset Selection Reset

## Requirements

### Functional
1.  **Reset Selection**: When the active tileset is changed via the dropdown, the current tile selection must be reset to the first tile (0,0).
2.  **Default Selection Size**: The reset selection should have a width and height of 1 (single tile).

### Non-Functional
-   **Performance**: The reset should happen instantly with the tileset change.
