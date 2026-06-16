# @configbuilder/threeDEngine

Core 3D rendering engine package with modular architecture for Three.js-based 3D scene management.

## Features

- ✨ **Modular Architecture** - Clear separation of concerns with dedicated modules for different functionality
- 🎮 **Entity Management** - Flexible entity system with automatic mesh creation and updates
- 🎯 **Interactive Selection** - Built-in raycasting and selection management
- 🔧 **Property System** - Extensible runtime property handling
- 📦 **Factory Pattern** - Geometry, material, and mesh factories for easy customization
- 🎨 **Widget Definitions** - Predefined shapes (Box, Sphere, Cylinder, Group)
- 📊 **Event-Driven** - EventBus for decoupled communication
- 💾 **State Management** - SceneStore for scene serialization/deserialization

## Installation

```bash
npm install @configbuilder/threeDEngine
```

## Usage

### Basic Setup

```typescript
import { Engine, ThreeAdapter } from '@configbuilder/threeDEngine';

// Create engine
const engine = new Engine();

// Setup Three.js renderer
const container = document.getElementById('app');
const adapter = new ThreeAdapter(container, engine, {
  enableGrid: true,
  enableAxis: true
});
```

### Creating Objects

```typescript
// Create a box
engine.createWidget({
  id: 'my-box',
  type: 'box',
  properties: {
    width: 1,
    height: 1,
    depth: 1,
    color: '#ff0000',
    x: 0,
    y: 0,
    z: 0
  }
});

// Create a sphere
engine.createWidget({
  id: 'my-sphere',
  type: 'sphere',
  properties: {
    radius: 0.75,
    color: '#00cc99',
    x: 3,
    y: 0,
    z: 0
  }
});

// Create a cylinder
engine.createWidget({
  id: 'my-cylinder',
  type: 'cylinder',
  properties: {
    radiusTop: 0.5,
    radiusBottom: 0.5,
    height: 2,
    color: '#0099ff',
    x: -3,
    y: 0,
    z: 0
  }
});
```

### Modifying Properties

```typescript
// Update position
engine.updateWidgetProperty('my-box', 'x', 2);
engine.updateWidgetProperty('my-box', 'y', 1);

// Update appearance
engine.updateWidgetProperty('my-box', 'color', '#00ff00');

// Update geometry
engine.updateWidgetProperty('my-box', 'width', 2);
engine.updateWidgetProperty('my-box', 'height', 2);
```

### Events

```typescript
// Widget lifecycle
engine.events.on('widget-added', (widget) => {
  console.log('Added widget:', widget.id);
});

engine.events.on('widget-removed', (payload) => {
  console.log('Removed widget:', payload.id);
});

engine.events.on('widget-updated', (payload) => {
  console.log(`Updated ${payload.id}.${payload.property} = ${payload.value}`);
});

// Scene interaction
engine.events.on('object-selected', (widget) => {
  console.log('Selected:', widget?.id);
});

engine.events.on('object-hover', (widget) => {
  console.log('Hovering over:', widget?.id);
});

engine.events.on('scene-config-changed', (config) => {
  console.log('Scene config changed:', config);
});
```

### Scene Management

```typescript
// List all widgets
const widgets = engine.scene.list();

// Get specific widget
const widget = engine.scene.getWidget('my-box');

// Remove widget
engine.removeWidget('my-box');

// Scene serialization
const sceneJson = engine.serializeScene();
console.log(sceneJson);

// Scene deserialization
engine.deserializeScene(sceneJson);

// Scene configuration
engine.setSceneConfig({
  backgroundColor: 0x222222,
  enableGrid: true,
  enableAxis: false
});
```

### Selection Management

```typescript
// Select a widget
engine.selectWidget('my-box');

// Deselect
engine.selectWidget(null);

// Hover
engine.hoverWidget('my-sphere');
```

## Module Reference

### core/
- `Engine` - Main engine class
- `EventBus` - Publish/subscribe event system
- `types` - TypeScript interfaces and types

### widgets/
- `WidgetRegistry` - Registry for widget factories
- `BoxDefinition` - Box shape definition
- `SphereDefinition` - Sphere shape definition
- `CylinderDefinition` - Cylinder shape definition
- `GroupDefinition` - Group/container definition

### entities/
- `Entity` - Base entity class for managing widgets in 3D space
- `EntityManager` - Manages multiple entities
- `GroupEntity` - Container entity for hierarchical structures

### renderer/
- `ThreeAdapter` - Three.js integration layer
- `GeometryFactory` - Creates geometries for different widget types
- `MaterialFactory` - Creates materials with customizable properties
- `MeshFactory` - Creates mesh objects from widget definitions

### interaction/
- `EventHandler` - DOM event management
- `Raycaster` - Mouse-based 3D raycasting
- `SelectionManager` - Tracks selection and hover states
- `TransformGizmo` - Interactive transform manipulator (stub)

### runtime/
- `PropertySystem` - Extensible property handler system
- `PropertyHandlers` - Built-in property change handlers

### store/
- `SceneStore` - Scene state management and persistence

## Building

```bash
npm run build
```

Output is in the `dist/` directory.

## License

MIT
