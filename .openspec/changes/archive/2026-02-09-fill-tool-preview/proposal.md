## Why

The current fill tool implementation lacks visual feedback during operation. Users can drag to define an area, but only see a simple rectangular outline until they release the mouse button. This makes it difficult to predict the exact outcome, especially when using complex tile patterns or multi-tile selections. A visual preview improves precision and user confidence.

## What Changes

The Level Editor's canvas rendering logic will be updated to display a real-time preview of the selected tile(s) repeating across the dragged area when using the fill tool. The preview will be rendered with semi-transparency to distinguish it from placed tiles, while maintaining the selection boundary outline.

## Capabilities

### New Capabilities
- `level-editor-tools`: Enhancements to level editor tools including visual previews and interaction improvements.

### Modified Capabilities
<!-- None -->

## Impact

- **Level Editor**: Updates to `EditorCanvas.tsx` rendering logic. No changes to data structure or persistence.
