import * as THREE from 'three';
import { WidgetDefinition } from '../../core/types';

export const GroupDefinition = {
    create(def: WidgetDefinition): THREE.Group {
        const p = def.properties ?? {};

        const group = new THREE.Group();

        group.name = def.name ?? '';

        group.position.set(
            p.position?.x ?? 0,
            p.position?.y ?? 0,
            p.position?.z ?? 0
        );

        group.rotation.set(
            p.rotation?.x ?? 0,
            p.rotation?.y ?? 0,
            p.rotation?.z ?? 0
        );

        group.scale.set(
            p.scale?.x ?? 1,
            p.scale?.y ?? 1,
            p.scale?.z ?? 1
        );

        group.visible = p.visible ?? true;

        return group;
    }
};