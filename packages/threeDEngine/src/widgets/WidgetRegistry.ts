import * as THREE from "three";

import { WidgetDefinition } from "../core/types";

export type WidgetFactory = (def: WidgetDefinition) => THREE.Object3D;

export class WidgetRegistry {
    private factories = new Map<string, WidgetFactory>();

    register(type: string, factory: WidgetFactory) {
        this.factories.set(type, factory);
    }

    create(def: WidgetDefinition): THREE.Object3D {
        const factory = this.factories.get(def.type);

        if (!factory) {
            throw new Error(`Unknown widget type: ${def.type}`);
        }

        return factory(def);
    }
}