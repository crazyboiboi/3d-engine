import { EventBus, Events } from "../core";
import { EntityManager } from "../entities";
import { GLBImportService } from "./import/GLBImportService";

export class ImportManager {
    private glbImporter: GLBImportService;

    constructor(
        private events: EventBus<Events>,
        private entityManager: EntityManager,
    ) {
        this.glbImporter = new GLBImportService(this.events, this.entityManager);
    }

    async import(file: File) {
        if (this.glbImporter.canHandle(file)) {
            return this.glbImporter.import(file);
        }

        throw new Error("Unsupported format");
    }
}