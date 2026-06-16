import { EventBus, Events } from "../core";
import { Entity } from "../entities";

export class SelectionController {
    private selected: Set<Entity> = new Set();

    constructor(
        private events: EventBus<Events>
    ) {
        this.registerEvents();
    }

    private registerEvents() {
        this.events.on("selection:changed", this.onSelectionChange);
    }

    private onSelectionChange = (event: { entity: Entity | null }) => {
        if (!event.entity) {
            this.clear();
            return;
        }

        this.clear();
        this.select(event.entity);
    };

    select(entity: Entity) {
        this.selected.add(entity);
    }

    deselect(entity: Entity) {
        this.selected.delete(entity);
    }

    clear() {
        this.selected.clear();
    }

    getSelected(): Entity[] {
        return Array.from(this.selected);
    }

    getSelectedIds(): string[] {
        return Array.from(this.selected).map(x => x.widget.id);
    }

    isSelected(entity: Entity): boolean {
        return this.selected.has(entity);
    }
}