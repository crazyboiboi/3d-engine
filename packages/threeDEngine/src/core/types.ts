import { Entity } from "../entities";

export type WidgetProperties = Record<string, any>;
export type WidgetType = 'box' | 'sphere' | 'cylinder' | 'mesh' | 'group';

export interface WidgetDefinition {
    id: string;
    name: string;
    type: WidgetType;
    properties: WidgetProperties;
    children: WidgetDefinition[]
}

export type EntityPatch = {
    id: string;

    transform?: {
        position?: { x?: number; y?: number; z?: number };
        rotation?: { x?: number; y?: number; z?: number };
        scale?: { x?: number; y?: number; z?: number };
    };

    material?: {
        color?: string;
    };

    geometry?: {
        type?: string;
        params?: Record<string, any>;
    };
};

export interface SceneConfig {
    backgroundColor?: number | string;
    enableGrid?: boolean;
    enableAxis?: boolean;
    [key: string]: any;
}

export interface EngineOptions {
    width?: number;
    height?: number;
}

export type Events = {
    'canvas:resize': { width: number, height: number };

    'key:down': { key: string, shiftKey: boolean, altKey: boolean, ctrlKey: boolean };
    'wheel': { deltaY: number };

    'pointer:up': { x: number, y: number, button: number };
    'pointer:down': { x: number, y: number, button: number };
    'pointer:move': { x: number, y: number };

    'entity:added': { entity: Entity };
    'entity:removed': { removed: { id: string, entity: Entity }[] };
    'entity:updated': { updatedEntity: Entity, patch: EntityPatch };

    'entity:selected': { entity: Entity | null };
    'entity:hover': { entity: Entity | null };
    'entity:dblclick': { entity: Entity | null };

    'selection:changed': { entity: Entity | null };

    'selection:add': string[];
    'selection:removed': string[];

    'gizmo:dragging': boolean;

    'camera:orbit-start': { x: number, y: number };
    'camera:orbit': { x: number, y: number };
    'camera:orbit-end': { x: number, y: number };
    'camera:pan-start': { x: number, y: number };
    'camera:pan': { x: number, y: number };
    'camera:pan-end': { x: number, y: number };

    'scene-config:changed': SceneConfig;
    'scene:loaded': { config: SceneConfig; };
};
