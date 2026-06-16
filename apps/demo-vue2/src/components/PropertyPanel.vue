<template>
  <div class="property-panel">
    <h3>Properties</h3>
    <div v-if="!widget" class="empty">
      <p>Select an object to edit properties</p>
    </div>
    <div v-else class="props">
      <div class="prop-group">
        <label>ID</label>
        <input type="text" :value="widget.id" disabled />
      </div>
      <div class="prop-group">
        <label>Type</label>
        <input type="text" :value="widget.type" disabled />
      </div>
      
      <hr />
      
      <div class="prop-group">
        <label>X Position</label>
        <input 
          type="number" 
          step="0.1"
          :value="widget.properties?.x ?? 0"
          @change="updateProperty('x', $event)"
        />
      </div>
      <div class="prop-group">
        <label>Y Position</label>
        <input 
          type="number" 
          step="0.1"
          :value="widget.properties?.y ?? 0"
          @change="updateProperty('y', $event)"
        />
      </div>
      <div class="prop-group">
        <label>Z Position</label>
        <input 
          type="number" 
          step="0.1"
          :value="widget.properties?.z ?? 0"
          @change="updateProperty('z', $event)"
        />
      </div>

      <hr />

      <div v-if="widget.type === 'box'">
        <div class="prop-group">
          <label>Width</label>
          <input 
            type="number" 
            step="0.1"
            :value="widget.properties?.width ?? 1"
            @change="updateProperty('width', $event)"
          />
        </div>
        <div class="prop-group">
          <label>Height</label>
          <input 
            type="number" 
            step="0.1"
            :value="widget.properties?.height ?? 1"
            @change="updateProperty('height', $event)"
          />
        </div>
        <div class="prop-group">
          <label>Depth</label>
          <input 
            type="number" 
            step="0.1"
            :value="widget.properties?.depth ?? 1"
            @change="updateProperty('depth', $event)"
          />
        </div>
      </div>
      <div v-else-if="widget.type === 'sphere'">
        <div class="prop-group">
          <label>Radius</label>
          <input 
            type="number" 
            step="0.1"
            :value="widget.properties?.radius ?? 0.75"
            @change="updateProperty('radius', $event)"
          />
        </div>
      </div>
      <div v-else-if="widget.type === 'cylinder'">
        <div class="prop-group">
          <label>Top Radius</label>
          <input 
            type="number" 
            step="0.1"
            :value="widget.properties?.radiusTop ?? 0.5"
            @change="updateProperty('radiusTop', $event)"
          />
        </div>
        <div class="prop-group">
          <label>Bottom Radius</label>
          <input 
            type="number" 
            step="0.1"
            :value="widget.properties?.radiusBottom ?? 0.5"
            @change="updateProperty('radiusBottom', $event)"
          />
        </div>
        <div class="prop-group">
          <label>Height</label>
          <input 
            type="number" 
            step="0.1"
            :value="widget.properties?.height ?? 1"
            @change="updateProperty('height', $event)"
          />
        </div>
      </div>

      <hr />

      <div class="prop-group">
        <label>Color</label>
        <div class="color-input-wrapper">
          <input 
            type="color" 
            :value="hexToColor(widget.properties?.color ?? '#ff0000')"
            @change="updateProperty('color', $event)"
          />
          <span class="color-value">{{ widget.properties?.color ?? '#ff0000' }}</span>
        </div>
      </div>

      <hr />

      <button @click="deleteWidget" class="delete-btn">Delete</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'PropertyPanel',
  props: {
    widget: {
      type: Object,
      default: null
    }
  },
  methods: {
    updateProperty(property: string, event: any) {
      let value = event.target.value;
      if (property !== 'color') {
        value = parseFloat(value);
      }
      this.$emit('update-property', { property, value });
    },
    hexToColor(hex: string): string {
      // Convert hex string like '#ff0000' to the format expected by input[type="color"]
      return hex.startsWith('#') ? hex : '#' + hex;
    },
    deleteWidget() {
      if (confirm('Delete this widget?')) {
        this.$emit('delete-widget');
      }
    }
  }
});
</script>

<style scoped>
.property-panel {
  padding: 12px;
  height: 100%;
  overflow-y: auto;
  background: #f5f5f5;
}

.property-panel h3 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.empty {
  color: #999;
  font-size: 12px;
  padding: 16px 0;
}

.props {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.prop-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.prop-group label {
  font-size: 11px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.prop-group input[type="text"],
.prop-group input[type="number"] {
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
}

.prop-group input[type="text"]:disabled,
.prop-group input[type="number"]:disabled {
  background: #e8e8e8;
  color: #888;
  cursor: not-allowed;
}

.prop-group input[type="text"],
.prop-group input[type="number"] {
  background: white;
}

.prop-group input[type="text"]:focus,
.prop-group input[type="number"]:focus {
  outline: none;
  border-color: #4a9eff;
  box-shadow: 0 0 0 2px rgba(74, 158, 255, 0.1);
}

.color-input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.prop-group input[type="color"] {
  width: 40px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.color-value {
  font-size: 12px;
  font-family: monospace;
  color: #666;
  flex: 1;
}

hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 8px 0;
}

.delete-btn {
  margin-top: 8px;
  padding: 8px 12px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: #cc0000;
}
</style>
