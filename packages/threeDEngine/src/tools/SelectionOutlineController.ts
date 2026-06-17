import * as THREE from 'three';

import { Entity, EventBus, Events } from "..";

export class SelectionOutlineController {
    private box: THREE.Box3 = new THREE.Box3();
    private helper: THREE.Box3Helper;

    private target: Entity | null = null;

    constructor(
        private events: EventBus<Events>,
        private scene: THREE.Scene,
    ) {
        this.helper = new THREE.Box3Helper(this.box, new THREE.Color("#ffff00"));
        this.helper.visible = false;

        scene.add(this.helper);

        this.registerEvents();
    }

    private registerEvents() {
        this.events.on("selection:changed", (payload: { entity: Entity | null }) => {
            this.setTarget(payload.entity);
        });
    }

    setTarget(entity: Entity | null) {
        if (!entity?.object) {
            this.helper.visible = false;
            return;
        }
        
        this.target = entity;
        this.helper.visible = true;
    }

    update() {
        if (!this.target) return;

        this.box.setFromObject(this.target.object);
        this.helper.updateMatrixWorld(true);
    }

    dispose() {
        this.scene.remove(this.helper);
        this.helper.geometry.dispose();
    }
}