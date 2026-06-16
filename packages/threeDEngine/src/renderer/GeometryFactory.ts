import * as THREE from 'three';
import { WidgetDefinition } from '../core/types';
import { BoxDefinition, SphereDefinition, CylinderDefinition } from '../widgets/core';

export class GeometryFactory {
    static createGeometry(widget: WidgetDefinition): THREE.BufferGeometry | null {
        switch (widget.type) {
            case 'box':
                return BoxDefinition.createGeometry(widget);
            case 'sphere':
                return SphereDefinition.createGeometry(widget);
            case 'cylinder':
                return CylinderDefinition.createGeometry(widget);
            default:
                return null;
        }
    }
}
