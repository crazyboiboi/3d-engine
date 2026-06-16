import { EventBus } from '../core/EventBus';
import { EntityPatch, Events, SceneConfig } from '../core/types';
import { Entity, EntityManager } from "../entities";
import { ThreeAdapter } from "../renderer";

export class SceneManager {
    public config: SceneConfig;

    constructor(
        private events: EventBus<Events>,
        private entities: EntityManager,
        private adapter: ThreeAdapter,
        config: SceneConfig
    ) {
        this.config = config;
        this.applySceneConfig();

        this.registerEvents();
    }

    private registerEvents() {
        this.events.on("entity:added", this.onEntityCreated);
        this.events.on("entity:removed", this.onEntityRemoved);
        this.events.on("entity:updated", this.onEntityPatched);
    }

    private onEntityCreated = (event: { entity: Entity }) => {
        this.adapter.sceneAdd(event.entity.object);
    }

    private onEntityPatched = (event: { patch: EntityPatch }) => {
        const { patch } = event;

        const entity = this.entities.getEntityById(patch.id);
        if (!entity) return;

        this.adapter.applyPatch(entity, patch);
    }

    private onEntityRemoved = (event: { removed: { id: string, entity: Entity }[] }) => {
        for (const data of event.removed) {
            this.adapter.sceneRemove(data.entity.object);
        }
    }

    setConfig(config: Partial<SceneConfig>) {
        Object.assign(this.config, config);

        this.applySceneConfig();

        this.events.emit('scene-config:changed', this.config);
    }

    private applySceneConfig() {
        this.adapter.setBackground(this.config.backgroundColor as any);

        this.adapter.updateHelpers({
            enableGrid: this.config.enableGrid,
            enableAxis: this.config.enableAxis
        });
    }

    serialize() {
        return JSON.stringify({ config: this.config }, null, 2);
    }

    deserialize(json: string) {
        let parsed: any;

        try {
            parsed = JSON.parse(json);
        } catch {
            console.error(`[SceneManager] Failed to deserialize json string. JSON: ${json}`);
            return;
        }

        if (!parsed || typeof parsed !== 'object') return;

        if (parsed.config && typeof parsed.config === 'object') {
            Object.assign(this.config, parsed.config);
        }

        this.events.emit('scene:loaded', { config: this.config });
    }
}
