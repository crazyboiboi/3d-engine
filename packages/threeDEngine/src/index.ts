export { EngineFactory } from './EngineFactory';

// Core exports
export { Engine } from './core/Engine';
export { EventBus } from './core/EventBus';
export * from './core/types';

// Widget exports
export * from './widgets/core';

// Entity exports
export { Entity } from './entities/Entity';
export { EntityManager } from './entities/EntityManager';

// Renderer exports
export { ThreeAdapter } from './renderer/ThreeAdapter';
export { GeometryFactory } from './renderer/GeometryFactory';
export { MaterialFactory } from './renderer/MaterialFactory';

// Interaction exports
export { RaycastSystem } from './interaction/RaycasterSystem';
export { SelectionController } from './interaction/SelectionController';

// Tools exports
export { TransformGizmoController } from './tools/TransformGizmoController';
export { SelectionOutlineController } from './tools/SelectionOutlineController';

// Scene exports
export { SceneManager } from './scene/SceneManager';
