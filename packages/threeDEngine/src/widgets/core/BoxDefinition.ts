import * as THREE from "three";
import { WidgetDefinition } from "../../core";

export const BoxDefinition = {
    create(def: WidgetDefinition): THREE.Mesh {
        const p = def.properties;

        const geometry = new THREE.BoxGeometry(
            p.width ?? 1,
            p.height ?? 1,
            p.depth ?? 1
        );

        const material = new THREE.MeshStandardMaterial({
            color: p.color ?? '#00ff00'
        });

        return new THREE.Mesh(geometry, material);
    }
};