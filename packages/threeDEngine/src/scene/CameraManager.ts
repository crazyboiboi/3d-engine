import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { EventBus, Events } from '../core';
import { Entity } from '../entities';

interface CameraState {
    position: THREE.Vector3;
    target: THREE.Vector3;
    fov: number;
    near: number;
    far: number;
    zoom: number;
    minDistance: number;
    maxDistance: number;
}

interface FocusState {
    position: THREE.Vector3;
    target: THREE.Vector3;
}

export class CameraManager {
    public camera: THREE.PerspectiveCamera;
    public controls: OrbitControls;

    private state: CameraState;

    private focusOn: FocusState | null = null;

    constructor(
        private events: EventBus<Events>,
        private canvas: HTMLCanvasElement
    ) {
        const w = this.canvas.clientWidth || 800;
        const h = this.canvas.clientHeight || 600;

        this.camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 10000);
        this.camera.position.set(5, 5, 5);

        this.controls = new OrbitControls(this.camera, this.canvas);
        this.camera.lookAt(0, 0, 0);

        this.state = this.createDefaultState();

        this.registerEvents();
    }

    private createDefaultState(): CameraState {
        return {
            position: this.camera.position.clone(),
            target: this.controls.target.clone(),
            fov: this.camera.fov,
            near: this.camera.near,
            far: this.camera.far,
            zoom: this.camera.zoom,
            minDistance: 1,
            maxDistance: 1000
        };
    }

    private registerEvents() {
        this.events.on("canvas:resize", this.onCanvasResize);

        this.events.on("gizmo:dragging", this.onGizmoDragging);
    }

    private onCanvasResize = (event: { width: number, height: number }) => {
        this.camera.aspect = event.width / event.height;
        this.camera.updateProjectionMatrix();
    };

    private onGizmoDragging = (flag: boolean) => {
        this.controls.enabled = !flag;
    }

    private syncState() {
        this.state.position.copy(this.camera.position);
        this.state.target.copy(this.controls.target);
        this.state.fov = this.camera.fov;
        this.state.near = this.camera.near;
        this.state.far = this.camera.far;
        this.state.zoom = this.camera.zoom;
        this.state.minDistance = this.controls.minDistance;
        this.state.maxDistance = this.controls.maxDistance;
    }

    update() {
        this.controls.update();

        this.syncState();

        if (this.focusOn) {
            this.goToFocusOn();
        }
    }

    focus(entity: Entity) {
        const box = new THREE.Box3().setFromObject(entity.object);

        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3()).length();

        const offset = size * 1.2;

        const desiredPosition = center.clone().add(
            new THREE.Vector3(offset, offset, offset)
        );

        this.focusOn = {
            target: center,
            position: desiredPosition,
        };
    }

    private goToFocusOn() {
        if (!this.focusOn) return;

        const lerpFactor = 0.15;

        // Smooth position
        this.camera.position.lerp(this.focusOn.position, lerpFactor);

        // Smooth target
        this.controls.target.lerp(this.focusOn.target, lerpFactor);

        // Stop and reset when reached target
        const dist = this.camera.position.distanceTo(this.focusOn.position);
        if (dist < 0.05) {
            this.focusOn = null;
        }
    }

    setView(view: "top" | "front" | "side") {
        const distance = 10;

        switch (view) {
            case "top":
                this.camera.position.set(0, distance, 0);
                break;

            case "front":
                this.camera.position.set(0, 0, distance);
                break;

            case "side":
                this.camera.position.set(distance, 0, 0);
                break;
        }

        this.controls.target.set(0, 0, 0);
    }

    public getState(): CameraState {
        return this.state;
    }

    public getCamera(): THREE.PerspectiveCamera {
        return this.camera;
    }
}