import { ImportManager } from "../assets";
import { EntityManager } from "../entities";
import { InputController, InteractionController, RaycastSystem, SelectionController } from "../interaction";
import { ThreeAdapter } from "../renderer";
import { CameraManager, SceneManager } from "../scene";
import { SelectionOutlineController, TransformGizmoController } from "../tools";
import { WidgetRegistry } from "../widgets";
import { EventBus } from "./EventBus";
import { EngineOptions, Events, SceneConfig } from "./types";

export class Engine {
    public options: EngineOptions;

    public adapter: ThreeAdapter | null = null;

    public events: EventBus<Events>;

    public importManager: ImportManager;

    public sceneManager: SceneManager;
    public cameraManager: CameraManager;
    public entityManager: EntityManager;

    public inputController: InputController;
    public interactionController: InteractionController;
    public selectionController: SelectionController;

    public transformGizmo: TransformGizmoController;
    public selectionOutline: SelectionOutlineController;

    public raycastSystem: RaycastSystem;

    private started = false;
    private lastTime = 0;
    private rafId: number | null = null;

    constructor(
        private registry: WidgetRegistry,
        container: HTMLElement,
        sceneConfig: SceneConfig,
        options = {},
    ) {
        this.options = options;

        this.events = new EventBus();
        this.adapter = new ThreeAdapter(container);

        this.entityManager = new EntityManager(
            this.events,
            this.registry
        );

        this.sceneManager = new SceneManager(
            this.events,
            this.entityManager,
            this.adapter,
            sceneConfig
        );

        this.importManager = new ImportManager(
            this.events,
            this.entityManager
        );
        
        this.cameraManager = new CameraManager(
            this.events,
            this.adapter.getCanvas()
        );

        this.raycastSystem = new RaycastSystem(
            this.cameraManager.getCamera(),
            this.adapter.getCanvas()
        );

        this.transformGizmo = new TransformGizmoController(
            this.events,
            this.cameraManager.getCamera(),
            this.adapter.getCanvas(),
            this.adapter.getScene()
        );

        this.selectionOutline = new SelectionOutlineController(
            this.events,
            this.adapter.getScene()
        );

        this.inputController = new InputController(
            this.events,
            this.adapter.getCanvas()
        )

        this.interactionController = new InteractionController(
            this.events,
            this.raycastSystem,
            this.entityManager
        );

        this.selectionController = new SelectionController(this.events);

        this.initEventListeners();
    }

    private initEventListeners() {
        window.addEventListener("resize", this.onWindowResize);
    }

    private onWindowResize = () => {
        if (!this.adapter) return;

        const width = this.adapter.getCanvas().clientWidth;
        const height = this.adapter.getCanvas().clientHeight;

        this.events.emit("canvas:resize", { width, height });

        this.adapter.resize?.();
    }

    // -------------------------
    // ENGINE LIFECYCLE
    // -------------------------
    start() {
        if (this.started) return;

        this.started = true;
        this.lastTime = performance.now();
        this.loop(this.lastTime);
    }

    stop() {
        this.started = false;

        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    destroy() {
        this.stop();
    }

    // -------------------------
    // MAIN LOOP
    // -------------------------
    private loop = (time: number) => {
        if (!this.started) return;

        const delta = time - this.lastTime;
        this.lastTime = time;

        this.tick(delta);

        this.rafId = requestAnimationFrame(this.loop);
    };

    private tick(delta: number) {
        this.cameraManager.update();

        this.selectionOutline.update();

        // Future system pipeline hook
        // this.selectionController.tick(delta);

        this.adapter?.render(this.cameraManager.getCamera());
    }
}