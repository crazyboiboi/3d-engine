import { EventBus, Events, InteractionHandler } from "../core";
import { Entity, EntityManager } from "../entities";
import { RaycastSystem } from "./RaycasterSystem";

export class SelectionController implements InteractionHandler {
    private allowInteraction = true;

    private editScope: Entity | null = null;

    private selected: Set<Entity> = new Set();
    private hoveredEntity: Entity | null = null;

    private readonly DOUBLE_CLICK_DELAY = 300;
    private lastClickTime = 0;
    private lastClickedEntity: Entity | null = null;

    constructor(
        private events: EventBus<Events>,
        private entityManager: EntityManager,
        private raycast: RaycastSystem,
    ) {
        this.registerEvents();
    }

    private registerEvents() {
        this.events.on("gizmo:dragging", this.onGizmoDragging);

        this.events.on("interaction:fallback-click", this.onInteractionFallback);

        this.events.on("entity:removed", this.onEntityRemoved);
    }

    private onGizmoDragging = (flag: boolean) => {
        if (flag) this.allowInteraction = false;
    }

    private onInteractionFallback = () => {
        if (!this.allowInteraction) {
            this.allowInteraction = true;
            return;
        }

        this.clear();
        this.hoveredEntity = null;
        this.events.emit("selection:changed", { entities: this.getSelected() })

        // Detect double click on blank space to exit group editing
        const now = performance.now();

        const isDoubleClick = now - this.lastClickTime < this.DOUBLE_CLICK_DELAY;
        this.lastClickTime = now;

        if (isDoubleClick) {
            this.editScope = null;
        }
    }

    private onEntityRemoved = (payload: { removed: { id: string, entity: Entity }[] }) => {
        for (const { entity } of payload.removed) {
            if (this.selected.has(entity)) {
                this.deselect(entity);
            }
        }
    }

    isHit(x: number, y: number): boolean {
        const all = this.entityManager.getAllEntities();
        const hit = this.raycast.pick(x, y, all);
        return hit.length > 0;
    }

    onPointerDown(e: { button: number, shiftKey: boolean, ctrlKey: boolean }): void {
        //
    }

    onPointerMove(e: { x: number; y: number; }): void {
        const { x, y } = e;

        const allEntities = this.entityManager.getAllEntities();
        const candidates = this.filterSelectable(allEntities);
        const hit = this.raycast.pick(x, y, candidates);

        const rawEntity = hit.length
            ? this.entityManager.getEntity(hit[0].object)
            : null;

        const entity = this.resolveSelected(rawEntity)

        if (entity !== this.hoveredEntity) {
            this.hoveredEntity = entity;

            this.events.emit("entity:hover", { entity });
        }
    }

    onPointerUp(e: { x: number, y: number, shiftKey: boolean, ctrlKey: boolean }): void {
        if (!this.allowInteraction) {
            this.allowInteraction = true;
            return;
        }

        const { x, y, shiftKey, ctrlKey } = e;

        const now = performance.now();

        const allEntities = this.entityManager.getAllEntities();
        const candidates = this.filterSelectable(allEntities);
        const hit = this.raycast.pick(x, y, candidates);

        const rawEntity = hit.length
            ? this.entityManager.getEntity(hit[0].object)
            : null;

        const entity = this.resolveSelected(rawEntity);

        const isDoubleClick =
            entity &&
            this.lastClickedEntity === entity &&
            now - this.lastClickTime < this.DOUBLE_CLICK_DELAY;

        this.lastClickTime = now;
        this.lastClickedEntity = entity;

        if (isDoubleClick) {
            if (entity.widget.type === "group") {
                this.editScope = entity;
            }
            this.events.emit("entity:dblclick", { entity: entity });
            return;
        }

        if (!entity) return;

        if (ctrlKey || shiftKey) {
            if (this.selected.has(entity)) {
                this.selected.delete(entity);
            } else {
                this.selected.add(entity);
            }
        } else {
            this.clear();
            this.selected.add(entity);
        }

        this.events.emit("selection:changed", { entities: this.getSelected() });
    }

    select(entity: Entity) {
        if (this.selected.has(entity)) return;
        this.selected.add(entity);
        this.events.emit("selection:changed", { entities: this.getSelected() });
    }

    deselect(entity: Entity) {
        if (!this.selected.has(entity)) return;
        this.selected.delete(entity);
        this.events.emit("selection:changed", { entities: this.getSelected() });
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

        while (finalEntity.parent) {
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