import * as THREE from 'three';
import { WidgetDefinition } from '../../core/types';

export const GroupDefinition = {
    create(def: WidgetDefinition): THREE.Group {
        const group = new THREE.Group();

        return group;
    }
}
