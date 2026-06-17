import * as THREE from "three";

import { EntityPatch, WidgetDefinition } from "../core/types";

export class Entity {
    public widget: WidgetDefinition;
    public object: THREE.Object3D;

    public parent: Entity | null;
    public children: Entity[];

    constructor(widget: WidgetDefinition, object: THREE.Object3D, parent?: Entity) {
        this.widget = widget;
        this.object = object;
        this.parent = parent ?? null;
        this.children = [];
    }

    public updateWidget(newWgt: WidgetDefinition): EntityPatch | null {
        const patch = this.diff(this.widget, newWgt);

        this.widget = newWgt;

        if (Object.keys(patch).length === 0) return null;

        this.applyPatch(patch);

        return patch;
    }

    public syncWidgetFromObject(): EntityPatch | null {
        const next = structuredClone(this.widget);

        next.properties.x = this.object.position.x;
        next.properties.y = this.object.position.y;
        next.properties.z = this.object.position.z;

        next.properties.rotationX = this.object.rotation.x;
        next.properties.rotationY = this.object.rotation.y;
        next.properties.rotationZ = this.object.rotation.z;

        next.properties.scaleX = this.object.scale.x;
        next.properties.scaleY = this.object.scale.y;
        next.properties.scaleZ = this.object.scale.z;

        return this.updateWidget(next);
    }

    private diff(prev: WidgetDefinition, next: WidgetDefinition): EntityPatch {
        const patch: EntityPatch = {
            id: this.widget.id,
        };

        // position
        if (
            prev.properties.x !== next.properties.x ||
            prev.properties.y !== next.properties.y ||
            prev.properties.z !== next.properties.z
        ) {
            patch.transform = {
                position: {
                    x: next.properties.x,
                    y: next.properties.y,
                    z: next.properties.z,
                },
            };
        }

        // color
        if (prev.properties.color !== next.properties.color) {
            patch.material = {
                color: next.properties.color,
            };
        }

        // geometry change triggers full rebuild
        if (this.requiresRebuild(prev, next)) {
            patch.geometry = {
                type: next.type,
                params: next.properties,
            };
        }

        return patch;
    }

    public applyPatch(patch: EntityPatch): void {
        if (patch.transform?.position) {
            this.object.position.set(
                patch.transform.position.x as number,
                patch.transform.position.y as number,
                patch.transform.position.z as number
            );
        }

        if (patch.transform?.rotation) {
            this.object.rotation.set(
                patch.transform.rotation.x as number,
                patch.transform.rotation.y as number,
                patch.transform.rotation.z as number
            );
        }

        if (patch.transform?.scale) {
            this.object.scale.set(
                patch.transform.scale.x as number,
                patch.transform.scale.y as number,
                patch.transform.scale.z as number
            );
        }

        if (patch.material?.color) {
            const mesh = this.object as THREE.Mesh;

            if (mesh.material && "color" in mesh.material) {
                (mesh.material as THREE.MeshStandardMaterial).color.set(
                    patch.material.color
                );
            }
        }

        if (patch.geometry) {
            // hook into your factory system here
            // this.rebuildGeometry(patch.geometry);
        }
    }


    private requiresRebuild(prev: WidgetDefinition, next: WidgetDefinition) {
        const keys = ["width", "height", "depth", "radius", "radiusTop", "radiusBottom"];
        return keys.some((k) => prev.properties[k] !== next.properties[k]);
    }

    public addChild(child: Entity) {
        this.children.push(child);
        child.parent = this;

        this.object.add(child.object);
    }

    public removeChild(child: Entity) {
        this.children = this.children.filter(c => c !== child);
        child.parent = null;

        this.object.remove(child.object);
    }
}