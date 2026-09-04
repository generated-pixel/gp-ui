# gp-analytics Workspace

Angular monorepo containing the **`gp-analytics`** npm package and its interactive showcase demo application.

## Packages & Projects

| Project | Type | Description |
| :--- | :--- | :--- |
| [`gp-analytics`](projects/gp-analytics) | Library | High-performance analytics, telemetry, and rule-driven monitoring engine for Angular. |
| [`demo`](projects/demo) | Application | Interactive cockpit showcasing real-time metric tracking, `gp-rules` anomaly detection, `gp-ui` components, `gp-theme` styling, and `gp-css` utilities. |

## Ecosystem Integration

This workspace integrates:
- **`@generatedpixel/gp-ui`**: Enterprise UI components (`gp-button`, `gp-icon`, `gp-tag`, `gp-badge`, `gp-switch`).
- **`@generatedpixel/gp-ui-theme`**: Multi-theme system (Default, Ocean, Emerald, Amethyst, Sunset, Cyberpunk, Nord) and dark/light modes.
- **`@generatedpixel/gp-css`**: Utility-first CSS engine custom built for Generated Pixel.
- **`@generatedpixel/gp-rules`**: Business rules engine and live execution audit inspector (`gp-rule-inspector`).

## Available Scripts

```bash
# Build the gp-analytics library (ng-packagr)
npm run build:lib

# Build utility CSS via gp-css
npm run build:css

# Build the demo application
npm run build:demo

# Build both library and demo
npm run build

# Start the interactive demo application
npm start

# Run unit tests
npm test
```
