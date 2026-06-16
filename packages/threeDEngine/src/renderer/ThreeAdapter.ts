import * as THREE from 'three';

import { EntityPatch } from '../core';
import { Entity } from '../entities';

export class ThreeAdapter {
	private container: HTMLElement;

	private readonly scene: THREE.Scene;
	private readonly renderer: THREE.WebGLRenderer;

	private gridHelper: THREE.GridHelper | null = null;
	private axesHelper: THREE.AxesHelper | null = null;

	constructor(container: HTMLElement) {
		this.container = container;

		const width = this.container.clientWidth || 800;
		const height = this.container.clientHeight || 600;

		this.scene = new THREE.Scene();

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(width, height);

		this.container.appendChild(this.renderer.domElement);

		this.setupLighting();
	}

	private setupLighting() {
		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(5, 10, 7.5);

		this.scene.add(light);

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

		this.scene.add(ambientLight);
	}

	public updateHelpers(settings: { enableGrid?: boolean; enableAxis?: boolean }) {
		if (!this.scene) return;

		if (this.gridHelper) {
			this.scene.remove(this.gridHelper);
			this.gridHelper = null;
		}
		if (settings.enableGrid) {
			this.gridHelper = new THREE.GridHelper(10, 10);
			this.scene.add(this.gridHelper);
		}

		if (this.axesHelper) {
			this.scene.remove(this.axesHelper);
			this.axesHelper = null;
		}
		if (settings.enableAxis) {
			this.axesHelper = new THREE.AxesHelper(5);
			this.scene.add(this.axesHelper);
		}
	}

	// -------------------------
	// CANVAS OPERATIONS
	// -------------------------
	setBackground(color: number) {
		this.scene.background = new THREE.Color(color);
	}

	resize() {
		const width = this.container.clientWidth || 800;
		const height = this.container.clientHeight || 600;

		this.renderer.setSize(width, height);
	}

	render(camera: THREE.Camera) {
		this.renderer.render(
			this.scene,
			camera
		);
	}

	dispose() {
		this.renderer.dispose();

		const canvas = this.renderer.domElement;

		if (canvas.parentElement) {
			canvas.parentElement.removeChild(canvas);
		}
	}

	// -------------------------
	// SCENE OPERATIONS
	// -------------------------

	sceneAdd(object: THREE.Object3D) {
		this.scene.add(object);
	}

	sceneRemove(object: THREE.Object3D) {
		this.scene.remove(object);
	}

	applyPatch(entity: Entity, patch: EntityPatch) {
		const { object: obj, widget } = entity;

		// transform
		if (patch.transform?.position) {
			const p = patch.transform.position;
			if (p.x !== undefined) obj.position.x = p.x;
			if (p.y !== undefined) obj.position.y = p.y;
			if (p.z !== undefined) obj.position.z = p.z;
		}

		if (patch.transform?.rotation) {
			const r = patch.transform.rotation;
			if (r.x !== undefined) obj.rotation.x = r.x;
			if (r.y !== undefined) obj.rotation.y = r.y;
			if (r.z !== undefined) obj.rotation.z = r.z;
		}

		if (patch.transform?.scale) {
			const s = patch.transform.scale;
			if (s.x !== undefined) obj.scale.x = s.x;
			if (s.y !== undefined) obj.scale.y = s.y;
			if (s.z !== undefined) obj.scale.z = s.z;
		}

		// material
		if (patch.material?.color) {
			obj.traverse((c: any) => {
				if (c.isMesh && c.material?.color) {
					c.material.color.set(patch.material!.color);
				}
			});
		}

		// geometry rebuild (TODO)
		if (patch.geometry) {
			// const newObj = MeshFactory.createMesh({
			// 	...entity.widget,
			// 	...patch.geometry,
			// })

			// if (!newObj || !obj.parent) return;

			// newObj.position.copy(obj.position);
			// newObj.rotation.copy(obj.rotation);
			// newObj.scale.copy(obj.scale);

			// obj.parent.add(newObj);
			// obj.parent.remove(obj);
		}
	}

	// -------------------------
	// ACCESSORS
	// -------------------------

	getScene() {
		return this.scene;
	}

	getRenderer() {
		return this.renderer;
	}

	getCanvas() {
		return this.renderer.domElement;
	}
}