# 3D Engine (threeDEngine)

A TypeScript-based 3D rendering engine built on Three.js with Vue 2 integration. Features a modular architecture with clear separation of concerns for entities, rendering, interaction, and property management.

## Project Structure

```
├── packages/
│   └── threeDEngine/          # Core 3D engine package
│       ├── src/
│       │   ├── core/          # Engine, EventBus, and type definitions
│       │   ├── widgets/       # Widget definitions and registry
│       │   ├── entities/      # Entity management system
│       │   ├── renderer/      # Three.js adapter and factories
│       │   ├── interaction/   # Input handling, raycasting, selection
│       │   ├── runtime/       # Property system and handlers
│       │   └── store/         # Scene state management
│       └── dist/              # Compiled JavaScript
│
├── apps/
│   └── demo-vue2/             # Vue 2 demo application
│       ├── src/
│       │   ├── App.vue
│       │   ├── main.ts
│       │   └── components/
│       └── vite.config.ts
│
└── README.md
```

## Prerequisites

- Node.js 16+
- npm 7+

## Installation

```bash
# Install root dependencies
npm install

# Dependencies are automatically linked via npm workspaces
```

## Building

### Build all packages
```bash
npm run build
```

### Build only the threeDEngine package
```bash
npm --prefix packages/threeDEngine run build
```

### Build only the demo app
```bash
npm --prefix apps/demo-vue2 run build
```

## Development

### Start demo application in dev mode
```bash
npm run dev:demo
```

This starts the Vite dev server for the Vue 2 demo at `http://localhost:3000`

### Watch and rebuild threeDEngine during development
```bash
cd packages/threeDEngine
npm run build -- --watch
```

## Package Information

### `@configbuilder/threeDEngine`

Core 3D rendering engine with the following modules:

| Module | Purpose |
|--------|---------|
| **core/** | Engine initialization, event bus, and type definitions |
| **widgets/** | Widget definitions (Box, Sphere, Cylinder, Group) and registry |
| **entities/** | Entity lifecycle management (Entity, EntityManager, GroupEntity) |
| **renderer/** | Three.js rendering layer (ThreeAdapter, factories) |
| **interaction/** | User input handling (EventHandler, Raycaster, SelectionManager, TransformGizmo) |
| **runtime/** | Property system for extensible widget properties |
| **store/** | Scene state management (SceneStore) |

## API Quick Start

### Creating an Engine

```typescript
import { Engine, ThreeAdapter } from '@configbuilder/threeDEngine';

// Create engine instance
const engine = new Engine();

// Initialize Three.js adapter
const container = document.getElementById('canvas-container');
const adapter = new ThreeAdapter(container, engine);
```

### Creating Widgets

```typescript
// Add a box widget
const boxWidget = engine.createWidget({
  id: 'box-1',
  type: 'box',
  properties: {
    width: 2,
    height: 2,
    depth: 2,
    color: '#ff0000',
    x: 0,
    y: 0,
    z: 0
  }
});

// Add a sphere widget
const sphereWidget = engine.createWidget({
  id: 'sphere-1',
  type: 'sphere',
  properties: {
    radius: 1,
    color: '#00cc99',
    x: 3,
    y: 0,
    z: 0
  }
});
```

### Updating Properties

```typescript
// Update widget properties
engine.updateWidgetProperty('box-1', 'color', '#0099ff');
engine.updateWidgetProperty('box-1', 'x', 2);
```

### Event Listening

```typescript
// Listen for widget events
engine.events.on('widget-added', (widget) => {
  console.log('Widget added:', widget.id);
});

engine.events.on('object-selected', (widget) => {
  console.log('Selected:', widget?.id);
});
```

## Supported Widget Types

- **box** - Rectangular prism
- **sphere** - Spherical geometry
- **cylinder** - Cylindrical geometry
- **group** - Container for other objects

## License

MIT
