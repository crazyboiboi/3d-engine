import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

import { Entity } from '../entities';
import { EventBus, Events } from '../core';

// type EngineEvents = {
//     "transform-start": Entity;
//     "transform-end": Entity;
// };

export class TransformGizmoController {
    private mode: 'translate' | 'rotate' | 'scale' = 'translate';

    private gizmo: TransformControls | null = null;
    private activeEntity: Entity | null = null;

    constructor(
        private events: EventBus<Events>,
        camera: THREE.Camera,
        domElement: HTMLElement,
        scene: THREE.Scene,
    ) {
        this.gizmo = new TransformControls(camera, domElement);

        this.gizmo.name = 'TransformGizmo';

        scene.add(this.gizmo);

        // Set default mode
        this.gizmo.setMode(this.mode);

        this.initEventListeners();

        this.registerEvents();
    }

    private initEventListeners () {
        if (!this.gizmo) return;

        // Add event listeners
        this.gizmo.addEventListener('dragging-changed', (e) => {
            if (!this.activeEntity) return;

            this.events.emit("gizmo:dragging", e.value);

            if (!e.value) {
                const patch = this.activeEntity.syncWidgetFromObject();

                if (patch) {
                    this.events.emit("entity:updated", {
                        updatedEntity: this.activeEntity,
                        patch
                    });
                }
            }
        });
    }

    private registerEvents() {
        this.events.on("selection:changed", (payload: { entity: Entity | null }) => {
            this.attach(payload.entity);
        });
    }

    attach(entity: Entity | null): void {
        if (!this.gizmo) return;

        if (!entity?.object) {
            this.detach();
            return;
        }

        this.activeEntity = entity;
        this.gizmo.attach(entity.object);
    }

    detach(): void {
        if (!this.gizmo) return;

        this.activeEntity = null;
        this.gizmo.detach();
    }

    setMode(mode: 'translate' | 'rotate' | 'scale'): void {
        if (!this.gizmo) return;

        this.mode = mode;
        this.gizmo?.setMode(mode);
    }

    getGizmo(): TransformControls | null {
        return this.gizmo;
    }

    dispose(): void {
        if (!this.gizmo) return;

        this.detach();

        this.gizmo.dispose();
        this.gizmo = null;
    }
}