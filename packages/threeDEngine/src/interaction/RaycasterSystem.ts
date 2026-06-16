import * as THREE from "three";
import { Entity } from "../entities";

export class RaycastSystem {
    private mouse = new THREE.Vector2();
    private raycaster = new THREE.Raycaster();

    constructor(
        private camera: THREE.Camera,
        private canvas: HTMLCanvasElement
    ) {}

    pick(x: number, y: number, selectables: Entity[]) {
        const objects = selectables.map(x => x.object);

        const rect = this.canvas.getBoundingClientRect();

        this.mouse.x = ((x - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((y - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        return this.raycaster.intersectObjects(objects, true); 
    }
}