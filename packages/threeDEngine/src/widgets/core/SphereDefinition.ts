import * as THREE from 'three';
import { WidgetDefinition } from '../../core/types';

export const SphereDefinition = {
    create(def: WidgetDefinition): THREE.Mesh {
        const p = def.properties;

        const geometry = new THREE.SphereGeometry(
            p.radius ?? 0.75,
            p.widthSegments ?? 32,
            p.heightSegments ?? 16,
        );

        const material = new THREE.MeshStandardMaterial({
            color: p.color ?? '#00cc99'
        });

        return new THREE.Mesh(geometry, material);
    }
}
