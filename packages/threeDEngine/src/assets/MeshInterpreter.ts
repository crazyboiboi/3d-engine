import * as THREE from "three";

import { WidgetDefinition } from "..";

export class MeshInterpreter {
    canHandle(obj: THREE.Object3D): boolean {
        return (obj as any).isMesh === true;
    }

    interpret(object: THREE.Object3D): WidgetDefinition {
        const mesh = object as THREE.Mesh;

        return {
            id: mesh.uuid,
            name: mesh.name || "Mesh", // TODO: update to have uniqueness later
            type: "mesh",
            children: [],
            properties: {
                position: {
                    x: mesh.position.x,
                    y: mesh.position.y,
                    z: mesh.position.z
                },
                rotation: {
                    x: mesh.rotation.x,
                    y: mesh.rotation.y,
                    z: mesh.rotation.z
                },
                scale: {
                    x: mesh.scale.x,
                    y: mesh.scale.y,
                    z: mesh.scale.z
                },
                visible: mesh.visible
            }
        };
    }
}