import * as THREE from "three";

import { Entity } from './Entity';
import { EntityPatch, Events, WidgetDefinition, WidgetType } from '../core/types';
import { EventBus } from "../core";
import { WidgetRegistry } from "../widgets";

export class EntityManager {
    private idToEntities: Map<string, Entity> = new Map();
    private objectToEntities: Map<THREE.Object3D, Entity> = new Map();

    constructor(
        private events: EventBus<Events>,
        private registry: WidgetRegistry
    ) { }

    addEntityFromWidget(widget: WidgetDefinition): Entity | null {
        if (!widget.id) {
            widget.id = `${widget.type}_${Math.floor(Math.random() * 10000)}`;
        }
        const mesh = this.registry.create(widget);

        const entity = new Entity(widget, mesh);
        this.register(entity);

        return entity;
    }

    addEntityFromObject(object: THREE.Object3D, widget?: WidgetDefinition): Entity {
        // TODO: update default for this
        const finalWidget: WidgetDefinition = widget ?? {
            id: `mesh_${Math.floor(Math.random() * 10000)}`,
            name: "Mesh",
            type: "mesh",
            children: [],
            properties: {}
        };

        const entity = new Entity(finalWidget, object);
        this.register(entity);

        return entity;
    }

    private register(entity: Entity) {
        this.idToEntities.set(entity.widget.id, entity);
        this.objectToEntities.set(entity.object, entity);

        this.events.emit("entity:added", { entity });
    }

    updateEntity(widget: WidgetDefinition): EntityPatch | null {
        const entity = this.idToEntities.get(widget.id);
        if (!entity) return null;

        const patch = entity.updateWidget(widget);
        if (!patch) return null;

        this.events.emit("entity:updated", {
            updatedEntity: entity,
            patch
        });

        return patch;
    }

    removeEntity(id: string): Entity | null {
        const entity = this.idToEntities.get(id);
        if (!entity) return null;

        this.events.emit("entity:removed", { removed: [{ id, entity }] });

        this.idToEntities.delete(id);

        return entity;
    }

    getEntity(object: THREE.Object3D): Entity | null {
        let current: THREE.Object3D | null = object;

        while (current) {
            const entity = this.objectToEntities.get(current);
            if (entity) return entity;
            current = current.parent;
        }

        return null;
    }

    getEntityById(id: string): Entity | null {
        const entity = this.idToEntities.get(id);
        return entity || null;
    }

    getAllEntities(): Entity[] {
        return Array.from(this.idToEntities.values());
    }

    clear() {
        const removed = Array.from(this.idToEntities.entries()).map(([id, entity]) => ({ id, entity }));

        this.idToEntities.clear();
        this.objectToEntities.clear();

        this.events.emit("entity:removed", { removed });
    }
}
