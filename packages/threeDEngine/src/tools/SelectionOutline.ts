import * as THREE from 'three';

import { Entity, EventBus, Events } from "..";

export class SelectionOutline {
    private helpers: Map<Entity, THREE.Box3Helper> = new Map();

    constructor(
        private events: EventBus<Events>,
        private scene: THREE.Scene,
    ) {
        this.registerEvents();
    }

    private registerEvents() {
        this.events.on("selection:changed", (payload: { entities: Entity[] }) => {
            this.setTargets(payload.entities);
        });
    }

    setTargets(entities: Entity[]) {
        const next = new Set(entities);

        for (const [entity, helper] of this.helpers.entries()) {
            if (!next.has(entity)) {
                this.scene.remove(helper);
                helper.geometry.dispose();
                this.helpers.delete(entity);
            }
        }

        for (const entity of entities) {
            if (!this.helpers.has(entity)) {
                const box = new THREE.Box3().setFromObject(entity.object);
                const helper = new THREE.Box3Helper(
                    box,
                    new THREE.Color("#ffff00")
                );

                this.scene.add(helper);
                this.helpers.set(entity, helper);
            }
        }
    }

    update() {
        for (const [entity, helper] of this.helpers.entries()) {
            if (!entity.object) continue;

            const box = helper.box;
            box.setFromObject(entity.object);

            helper.updateMatrixWorld(true);
        }
    }

    dispose() {
        for (const helper of this.helpers.values()) {
            this.scene.remove(helper);
            helper.geometry.dispose();
        }

        this.helpers.clear();
    }
}