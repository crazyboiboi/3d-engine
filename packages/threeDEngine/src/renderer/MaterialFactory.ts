import * as THREE from 'three';

export class MaterialFactory {
    static createMaterial(properties?: Record<string, any>): THREE.MeshStandardMaterial {
        return new THREE.MeshStandardMaterial({
            color: properties?.color ?? '#ffffff',
            metalness: properties?.metalness ?? 0,
            roughness: properties?.roughness ?? 1,
        });
    }

    static createLightMaterial(): THREE.MeshStandardMaterial {
        return this.createMaterial({ color: '#ffff00', metalness: 0.8, roughness: 0.2 });
    }
}
