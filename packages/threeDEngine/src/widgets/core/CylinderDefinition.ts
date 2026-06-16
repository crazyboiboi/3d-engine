import * as THREE from 'three';
import { WidgetDefinition } from '../../core/types';

export const CylinderDefinition = {
    create(def: WidgetDefinition): THREE.Mesh {
        const p = def.properties;

        const geometry = new THREE.CylinderGeometry(
            p.radiusTop ?? 0.5,
            p.radiusBottom ?? 0.5,
            p.height ?? 1,
            p.radialSegments ?? 24
        );

        const material = new THREE.MeshStandardMaterial({
            color: p.color ?? '#0099ff'
        });

        return new THREE.Mesh(geometry, material);
    }
}
