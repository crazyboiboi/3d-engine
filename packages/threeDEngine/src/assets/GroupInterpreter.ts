import * as THREE from "three";

import { WidgetDefinition } from "..";

export class GroupInterpreter {
    canHandle(obj: THREE.Object3D): boolean {
        return obj.type === "Group";
    }

    interpret(object: THREE.Object3D): WidgetDefinition {
        const group = object as THREE.Group

        return {
            id: group.uuid,
            name: group.name || "Group", // TODO: update to have uniqueness later
            type: "group",
            children: [],
            properties: {
                position: {
                    x: group.position.x,
                    y: group.position.y,
                    z: group.position.z
                },
                rotation: {
                    x: group.rotation.x,
                    y: group.rotation.y,
                    z: group.rotation.z
                },
                scale: {
                    x: group.scale.x,
                    y: group.scale.y,
                    z: group.scale.z
                },
                visible: group.visible
            }
        };
    }
}