import { EventBus, Events } from "../core";
import { Entity } from "../entities";

export class SelectionController {
    private selected: Set<Entity> = new Set();

    private editScope: Entity | null = null;

    constructor(
        private events: EventBus<Events>,
    ) {
        this.registerEvents();
    }

    private registerEvents() {
        this.events.on("selection:changed", this.onSelectionChange);

        this.events.on("entity:dblclick", this.onEntityDblClick);
    }

    private onSelectionChange = (event: { entity: Entity | null }) => {
        if (!event.entity) {
            this.clear();
            return;
        }

        this.clear();
        this.select(event.entity);
    };

    private onEntityDblClick = (event: { entity: Entity | null }) => {
        // TODO
        if (!event.entity) return;

        if (event.entity.widget.type === "group") {
            this.editScope = event.entity;
        }
    }

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

    setEditScope(entity: Entity | null) {
        this.editScope = entity;
    }

    filterSelectable(entities: Entity[]): Entity[] {
        return entities.filter(e => this.isSelectable(e));
    }

    private isSelectable(entity: Entity): boolean {
        if (!this.editScope) {
            return entity.parent === null;
        }

        return entity.parent === this.editScope;
    }

    resolveSelected(rawEntity: Entity | null) {
        if (!rawEntity) return null;

        let isInScope = false;

        if (!this.editScope) {
            // If not in group editing, anything can be selected
            isInScope = true;
        } else {
            // Check if target is within the edited group
            // (by the selected target's root has parent)
            let curr: Entity | null = rawEntity;
            while (curr) {
                if (curr === this.editScope) {
                    isInScope = true;
                    break;
                }
                curr = curr.parent;
            }
        }

        if (!isInScope) return null;

        // Find top-most selectable entity
        let finalEntity = rawEntity;

        while(finalEntity.parent) {
            const parent = finalEntity.parent as Entity;

            // If we are in group editing, select the child
            if (this.editScope && this.editScope === parent) {
                break;
            }

            finalEntity = parent;
        }
        
        return finalEntity;
    }
}