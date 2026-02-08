## 1. Migration

- [x] 1.1 Update `EditorCanvas.tsx` to use `window` event listeners for `mousemove` and `mouseup` during drag operations.
- [x] 1.2 Remove `onMouseLeave` prop from `EditorCanvas` render method to prevent premature drag termination.
- [x] 1.3 Ensure `handleMouseMove` correctly handles coordinates relative to the canvas even when the event target is `window`.

## 2. Verification

- [x] 2.1 Verify brush/eraser tool continuity when dragging outside canvas.
- [x] 2.2 Verify fill tool preview/action commits only on mouse release, even if cursor is outside canvas.
