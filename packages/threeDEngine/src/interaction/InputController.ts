import { EventBus, Events } from "../core";

export class InputController {
    constructor(
        private events: EventBus<Events>,
        private canvas: HTMLCanvasElement,
    ) {
        this.setEventListeners();
    }

    private setEventListeners() {
        this.canvas.addEventListener('pointerdown', this.onPointerDown);
        this.canvas.addEventListener('pointermove', this.onPointerMove);
        this.canvas.addEventListener('pointerup', this.onPointerUp);

        this.canvas.addEventListener('wheel', this.onWheel);

        window.addEventListener('keydown', this.onKeyDown);
    }

    private onPointerDown = (e: PointerEvent) => {
        this.events.emit("pointer:down", {
            x: e.clientX,
            y: e.clientY,
            button: e.button,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            altKey: e.altKey
        });
    };

    private onPointerMove = (e: PointerEvent) => {
        this.events.emit("pointer:move", {
            x: e.clientX,
            y: e.clientY
        });
    };

    private onPointerUp = (e: PointerEvent) => {
        this.events.emit("pointer:up", {
            x: e.clientX,
            y: e.clientY,
            button: e.button,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            altKey: e.altKey
        });
    };

    private onWheel = (e: WheelEvent) => {
        this.events.emit("wheel", {
            deltaY: e.deltaY
        });
    };

    private onKeyDown = (e: KeyboardEvent) => {
        this.events.emit("key:down", {
            key: e.key,
            shiftKey: e.shiftKey,
            ctrlKey: e.ctrlKey,
            altKey: e.altKey
        });
    };
}