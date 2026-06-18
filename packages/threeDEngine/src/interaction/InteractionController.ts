import { EventBus, Events } from "../core";
import { RaycastSystem } from "./RaycasterSystem";
import { Entity, EntityManager } from "../entities";
import { SelectionController } from "./SelectionController";

type InteractionMode = "idle" | "pan" | "orbit" | "gizmo";

export class InteractionController {
    private mode: InteractionMode = "idle";
    private prevMode: InteractionMode = "idle";

    private readonly CLICK_THRESHOLD = 5;
    private readonly DOUBLE_CLICK_DELAY = 300;

    private lastClickTime = 0;

    private isPointerDown: boolean = false;
    private lastMouseDownPos: { x: number, y: number } = { x: -1, y: -1 };

    private hoveredEntity: Entity | null = null;
    private selectedEntity: Entity | null = null;
    private lastClickedEntity: Entity | null = null;

    constructor(
        private events: EventBus<Events>,
        private raycast: RaycastSystem,
        private entityManager: EntityManager,
        private selectionController: SelectionController
    ) {
        this.registerEvents();
    }

    private registerEvents() {
        this.events.on("gizmo:dragging", this.onGizmoDragging);

        this.events.on("pointer:down", this.onPointerDown);
        this.events.on("pointer:up", this.onPointerUp);
        this.events.on("pointer:move", this.onPointerMove);
    }

    private onGizmoDragging = (flag: boolean) => {
        if (flag) {
            this.prevMode = this.mode;
            this.mode = "gizmo";
        } else {
            this.mode = this.prevMode;
        }
    }

    private onPointerDown = (event: { x: number, y: number, button: number }) => {
        this.isPointerDown = true;

        const { x, y, button } = event;

        this.lastMouseDownPos = { x, y };

        if (button === 2) {
            this.mode = "orbit";
            this.events.emit("camera:orbit-start", { x, y });
        }

        if (button === 1) {
            this.mode = "pan";
            this.events.emit("camera:pan-start", { x, y });
        }
    }

    private onPointerMove = (event: { x: number, y: number }) => {
        const { x, y } = event;

        if (!this.isPointerDown) {
            const allEntities = this.entityManager.getAllEntities();
            const candidates = this.selectionController.filterSelectable(allEntities);
            const hit = this.raycast.pick(x, y, candidates);

            const rawEntity = hit.length
                ? this.entityManager.getEntity(hit[0].object)
                : null;

            const entity = this.selectionController.resolveSelected(rawEntity)

            if (entity !== this.hoveredEntity) {
                this.hoveredEntity = entity;

                this.events.emit("entity:hover", { entity });
            }
            return;
        }

        if (this.mode === "orbit") {
            this.events.emit("camera:orbit", event);
        }

        if (this.mode === "pan") {
            this.events.emit("camera:pan", event);
        }
    }

    private onPointerUp = (event: { x: number, y: number, button: number }) => {
        const { x, y } = event;

        this.isPointerDown = false;

        const dx = x - this.lastMouseDownPos.x;
        const dy = y - this.lastMouseDownPos.y;
        const isClick = Math.abs(dx) < this.CLICK_THRESHOLD && Math.abs(dy) < this.CLICK_THRESHOLD;

        switch (this.mode) {
            case "orbit": {
                this.events.emit("camera:orbit-end", { x, y });
                break;
            }
            case "pan": {
                this.events.emit("camera:pan-end", { x, y });
                break;
            }
            case "idle": {
                if (!isClick) break;

                const now = performance.now();

                const allEntities = this.entityManager.getAllEntities();
                const candidates = this.selectionController.filterSelectable(allEntities);
                const hit = this.raycast.pick(x, y, candidates);

                const rawEntity = hit.length
                    ? this.entityManager.getEntity(hit[0].object)
                    : null;

                const entity = this.selectionController.resolveSelected(rawEntity);

                const isDoubleClick =
                    entity &&
                    this.lastClickedEntity === entity &&
                    now - this.lastClickTime < this.DOUBLE_CLICK_DELAY;

                this.lastClickTime = now;
                this.lastClickedEntity = entity;

                if (!entity) {
                    this.selectedEntity = null;
                    this.events.emit("selection:changed", { entity: null });
                    return;
                }

                if (isDoubleClick) {
                    this.events.emit("entity:dblclick", { entity: entity });
                    return;
                }

                if (entity && entity !== this.selectedEntity) {
                    this.selectedEntity = entity;
                    this.events.emit("selection:changed", { entity: entity });
                }
                break;
            }
            default:
                break;
        }

        this.mode = "idle";
    }
}