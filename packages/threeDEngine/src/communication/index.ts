import { Engine, Events, WidgetDefinition, WidgetType } from "../core";

export default class Communication {
    private APIInstance: any;

    constructor(
        private engine: Engine,
    ) {
        this.APIInstance = this.buildAPI();

        if (typeof window !== "undefined") {
            (window as any).__3D = this.APIInstance;
        }
    }

    public get API() {
        return this.APIInstance;
    }

    private dispatch(type: keyof Events, payload: any) {
        this.engine.events.emit(type, payload);
    }

    private buildAPI() {
        return {
            data: {
                import: (file: File) => this.engine.importManager.import(file)
            },

            events: {
                on: (event: keyof Events, cb: (payload: any) => void) => {
                    this.engine.events.on(event, cb);
                },
            },

            editor: {
                setGrid: (enable: boolean) => this.engine.sceneManager.setConfig({ enableGrid: enable }),
                setAxis: (enable: boolean) => this.engine.sceneManager.setConfig({ enableAxis: enable }),
                setBackground: (color: string) => this.engine.sceneManager.setConfig({ backgroundColor: color }),
            },

            object: {
                quickCreate: (type: string) => {
                    // TODO
                },

                create: (config: WidgetDefinition) => {
                    this.engine.entityManager.addEntityFromWidget(config);
                },

                update: (config: WidgetDefinition) => {
                    this.engine.entityManager.updateEntity(config);
                },

                delete: (id: string) => {
                    this.engine.entityManager.removeEntity(id);
                },
            },

            selection: {
                add: (ids: string[]) => {
                    for (const id of ids) {
                        const entity = this.engine.entityManager.getEntityById(id);
                        if (entity) this.engine.selectionController.select(entity);
                    }
                },

                remove: (ids?: string[]) => {
                    if (!ids) {
                        this.engine.selectionController.clear();
                    } else {
                        for (const id of ids) {
                            const entity = this.engine.entityManager.getEntityById(id);
                            if (entity) this.engine.selectionController.deselect(entity);
                        }
                    }
                },
            },
        };
    }
}