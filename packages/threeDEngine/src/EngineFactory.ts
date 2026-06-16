import Communication from "./communication";

import { Engine, SceneConfig } from "./core";
import { BoxDefinition, CylinderDefinition, GroupDefinition, SphereDefinition, WidgetRegistry } from "./widgets";

export class EngineFactory {
    static create(container: HTMLElement, config: SceneConfig) {
        const registry = this.createWidgetRegistry();

        // ENGINE (runtime brain)
        const engine = new Engine(registry, container, config);

        // COMMUNICATION (API LAYER)
        const communication = new Communication(engine);

        // BOOT ENGINE LOOP
        engine.start();

        return {
            engine,
            api: communication.API,
        };
    }

    static createWidgetRegistry() {
        const registry = new WidgetRegistry();

        // Register 3D components
        registry.register("box", BoxDefinition.create);
        registry.register("sphere", SphereDefinition.create);
        registry.register("cylinder", CylinderDefinition.create);
        registry.register("group", GroupDefinition.create);
        
        return registry;
    }
}