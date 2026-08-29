# @generatedpixel/gp-grid

Reactive, high-performance Grid & Dashboard Layout Engine for Angular, built natively for the `gp-ui`, `gp-css`, and `gp-theme` design ecosystem.

## Features
- **Signals-First Architecture**: 100% Signal-driven inputs, outputs, models, and real-time state reactivity.
- **Configurable Grid Systems**: Configurable columns, row heights, gap spacing, and fluid CSS grid rendering.
- **Interactive Drag & Resize**: Smooth touch and mouse dragging with live preview placeholder.
- **Collision Resolution & Dynamic Realignment**: Smart displacement ensures no widgets overlap during dragging.
- **Locked & Fixed Placement**:
  - `locked`: Anchored in place — never displaced by other widgets, and prevents widgets from being dropped over it.
  - `fixed`: Widget cannot be moved or resized by user dragging.
- **Widget Anatomy**: Header with drag handle, title, options button, lock indicator, and close button, plus flexible body container.
- **Theme Native**: Integrates seamlessly with `@generatedpixel/gp-ui-theme` tokens and dark/light modes.
