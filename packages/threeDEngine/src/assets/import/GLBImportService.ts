import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { EventBus, Events, WidgetDefinition } from "../../core";
import { GroupInterpreter, MeshInterpreter } from "..";
import { Entity, EntityManager } from "../../entities";

export class GLBImportService {
    private loader: GLTFLoader;

    private meshInterpreter: MeshInterpreter;
    private groupInterpreter: GroupInterpreter;

    constructor(
        private events: EventBus<Events>,
        private entityManager: EntityManager
    ) {
        this.loader = new GLTFLoader();

        this.meshInterpreter = new MeshInterpreter();
        this.groupInterpreter = new GroupInterpreter();
    }

    async import(file: File) {
        const gltf = await this.loadFile(file);

        this.handleImportObjectRecursive(gltf.scene, null);

        // Might need to generate event (e.g. import complete)
    }

    private handleImportObjectRecursive(obj: THREE.Object3D, parentEntity: Entity | null) {
        let entity: Entity | null = null;
        let widget: WidgetDefinition | null = null;

        if (this.groupInterpreter.canHandle(obj)) {
            widget = this.groupInterpreter.interpret(obj);
        } else if (this.meshInterpreter.canHandle(obj)) {
            widget = this.meshInterpreter.interpret(obj);
        }

        if (widget) {
            entity = this.entityManager.addEntityFromObject(obj, widget);
        }

        if (parentEntity && entity) {
            parentEntity.addChild(entity);
        }

        for (const child of [...obj.children]) {
            this.handleImportObjectRecursive(child, entity);
        }

        return entity;
    }

    private loadFile(file: File): any {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file);

            this.loader.load(url,
                (gltf) => resolve(gltf),
                undefined,
                (err) => reject(err)
            );
        });
    }

    public canHandle(file: File): boolean {
        return file.name.endsWith(".glb");
    }
}