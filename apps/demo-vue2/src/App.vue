<template>
  <div style="display:flex;height:100vh;background:#fff">
    <!-- Left Sidebar: Toolbar -->
    <div style="width:220px;padding:12px;border-right:1px solid #ddd;background:#f9f9f9;overflow-y:auto">
      <h3 style="margin:0 0 12px 0;font-size:14px;font-weight:600">Scene</h3>
      <button @click="addBox" style="width:100%;padding:8px;margin-bottom:8px;background:#4a9eff;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600">
        + Add Box
      </button>
      <button @click="addSphere" style="width:100%;padding:8px;margin-bottom:8px;background:#2c9f5c;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600">
        + Add Sphere
      </button>
      <button @click="addCylinder" style="width:100%;padding:8px;margin-bottom:8px;background:#7f5cff;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600">
        + Add Cylinder
      </button>
      <button @click="exportScene" style="width:100%;padding:8px;margin-bottom:8px;background:#666;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px">
        Export Scene
      </button>
      <div style="margin-bottom:12px">
        <label style="font-size:11px;display:block;margin-bottom:4px;color:#666;font-weight:600">Load Scene</label>
        <input type="file" @change="onFile" style="font-size:11px;width:100%" />
      </div>
      <div style="margin-bottom:12px;padding:10px;border:1px solid #ddd;border-radius:8px;background:#fff">
        <label style="font-size:11px;display:block;margin-bottom:6px;color:#666;font-weight:600">Background</label>
        <input type="color" v-model="sceneConfig.backgroundColor" @input="updateBackground" style="width:100%;height:32px;border:none;padding:0;cursor:pointer" />
        <div style="display:flex;justify-content:space-between;gap:8px;margin-top:10px;font-size:11px;color:#666">
          <label><input type="checkbox" v-model="sceneConfig.enableGrid" @change="toggleGrid" /> Grid</label>
          <label><input type="checkbox" v-model="sceneConfig.enableAxis" @change="toggleAxis" /> Axis</label>
        </div>
      </div>
      
      <hr style="border:none;border-top:1px solid #ddd;margin:12px 0" />
      
      <h4 style="margin:0 0 8px 0;font-size:12px;font-weight:600;color:#333">Camera Controls</h4>
      <div style="font-size:11px;color:#666;line-height:1.6">
        <p style="margin:0 0 4px 0"><strong>Right-click</strong>: Orbit</p>
        <p style="margin:0 0 4px 0"><strong>Scroll</strong>: Zoom</p>
        <p style="margin:0 0 4px 0"><strong>WASD/QE</strong>: Pan</p>
        <p style="margin:0 0 4px 0"><strong>Click</strong>: Select</p>
      </div>

      <hr style="border:none;border-top:1px solid #ddd;margin:12px 0" />

      <h4 style="margin:0 0 8px 0;font-size:12px;font-weight:600;color:#333">Objects</h4>
      <div v-if="sceneObjects.length === 0" style="font-size:11px;color:#999">
        No objects in scene
      </div>
      <div v-else style="display:flex;flex-direction:column;gap:4px">
        <button 
          v-for="obj in sceneObjects"
          :key="obj.id"
          @click="selectObject(obj.id)"
          :style="{
            padding: '6px 8px',
            background: selected && selected.id === obj.id ? '#4a9eff' : '#fff',
            color: selected && selected.id === obj.id ? '#fff' : '#333',
            border: '1px solid ' + (selected && selected.id === obj.id ? '#4a9eff' : '#ddd'),
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: selected && selected.id === obj.id ? '600' : '400',
            textAlign: 'left'
          }"
        >
          {{ obj.type }}
          <span style="opacity:0.7">#{{ obj.id.split('_')[1] }}</span>
        </button>
      </div>
    </div>

    <!-- Center: 3D View -->
    <div style="flex:1;display:flex;flex-direction:column;position:relative">
      <three-engine 
        ref="engine" 
        style="flex:1;position:relative"
        :scene-json="sceneConfig"
        @object-selected="onSelected" 
        @object-hover="onHover"
        @ready="onReady"
      />
    </div>

    <!-- Right Sidebar: Property Panel -->
    <div style="width:260px;border-left:1px solid #ddd;background:#f9f9f9;overflow-y:auto">
      <property-panel 
        :widget="selected"
        @update-property="onUpdateProperty"
        @delete-widget="deleteSelected"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PropertyPanel from './components/PropertyPanel.vue';
import ThreeEngine from './components/ThreeEngine.vue';

export default Vue.extend({
  name: 'App',
  components: { ThreeEngine, PropertyPanel },
  data() {
    return {
      engine: null as any,

      selected: null as any,
      sceneObjects: [] as any[],

      sceneConfig: {
        backgroundColor: '#222222',
        enableGrid: true,
        enableAxis: false,
      }
    };
  },
  watch: {
    selected() {
      this.updateSceneObjects();
    }
  },
  methods: {
    onReady(data: any) {
      this.engine = data;
    },

    updateBackground() {
      this.engine.api.editor.setBackground(this.sceneConfig.backgroundColor);
    },

    toggleGrid() {
      this.engine.api.editor.setGrid(this.sceneConfig.enableGrid);
    },

    toggleAxis() {
      this.engine.api.editor.setAxis(this.sceneConfig.enableAxis);
    },

    addWidget(type: string) {
      if (!this.engine) return;

      const baseProps = {
        type: type,
        x: 0,
        y: 0,
        z: 0,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
      } as any;

      if (type === 'box') {
        baseProps.width = 1;
        baseProps.height = 1;
        baseProps.depth = 1;
      }
      if (type === 'sphere') {
        baseProps.radius = 0.75;
      }
      if (type === 'cylinder') {
        baseProps.radiusTop = 0.5;
        baseProps.radiusBottom = 0.5;
        baseProps.height = 1;
      }

      this.engine.api.object.create({ type: type, properties: baseProps });

      this.updateSceneObjects();
    },
    addBox() {
      this.addWidget('box');
    },
    addSphere() {
      this.addWidget('sphere');
    },
    addCylinder() {
      this.addWidget('cylinder');
    },
    onSelected(payload: any) {
      this.selected = payload;
    },
    onHover(payload: any) {
      // noop
    },
    onUpdateProperty(data: any) {
      // const engine = (this.$refs.engine as any).engine;
      // if (!engine || !this.selected) return;
      // engine.updateWidgetProperty(this.selected.id, data.property, data.value);
      // this.selected = engine.scene.getWidget(this.selected.id);
    },
    deleteSelected() {
      // const engine = (this.$refs.engine as any).engine;
      // if (!engine || !this.selected) return;
      // engine.removeWidget(this.selected.id);
      // this.selected = null;
      // this.updateSceneObjects();
    },
    selectObject(id: string) {
      // const engine = (this.$refs.engine as any).engine;
      // if (!engine) return;
      // engine.selectWidget(id);
    },
    updateSceneObjects() {
      // if (!this.engine) return;
      // this.sceneObjects = this.engine.scene.list();
    },
    exportScene() {
      // const engine = (this.$refs.engine as any).engine;
      // if (!engine) return;
      // const json = engine.serializeScene();
      // const blob = new Blob([json], { type: 'application/json' });
      // const url = URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'scene.json';
      // a.click();
      // URL.revokeObjectURL(url);
    },
    onFile(e: any) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      this.engine.api.data.import(file);
    },
  },
  mounted() {
    this.engine.api.events.on("entity:added", (payload: any) => {
      this.sceneObjects.push(payload.entity.widget);
    });

    this.engine.api.events.on("selection:changed", (payload: any) => {
      if (payload.entity) {
        this.selected = payload.entity.widget;
      } else {
        this.selected = null;
      }
    });

    this.engine.api.events.on("entity:updated", (payload: any) => {
      if (this.selected.id === payload.patch.id) {
        this.selected = payload.updatedEntity.widget;
      }
    });
  }
});
</script>

