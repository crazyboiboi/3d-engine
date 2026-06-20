import { EventBus, Events, InteractionHandler } from "../core";
export class InteractionController {
    private activeHandler: InteractionHandler | null = null;

    constructor(
        private events: EventBus<Events>,
        private handlers: InteractionHandler[]
    ) {
        this.registerEvents();
    }

    private registerEvents() {
        this.events.on("pointer:down", this.onPointerDown);
        this.events.on("pointer:up", this.onPointerUp);
        this.events.on("pointer:move", this.onPointerMove);
    }

    private onPointerDown = (event: { x: number, y: number, button: number, shiftKey: boolean, altKey: boolean, ctrlKey: boolean }) => {
        const { x, y } = event;

        for (const handler of this.handlers) {
            if (handler.isHit(x, y)) {
                this.activeHandler = handler
                handler.onPointerDown?.(event);
                return;
            }
        }
    }

    private onPointerMove = (event: { x: number, y: number }) => {
        if (this.activeHandler) {
            this.activeHandler.onPointerMove?.(event);
            return;
        }
    }

    private onPointerUp = (event: { x: number, y: number, button: number, shiftKey: boolean, altKey: boolean, ctrlKey: boolean }) => {
        if (this.activeHandler) {
            this.activeHandler.onPointerUp?.(event);
            this.activeHandler = null;
            return;
        }

        // Emit a fallback event for the handler to handle when clicked nothing
        this.events.emit("interaction:fallback-click", event);
    }
}