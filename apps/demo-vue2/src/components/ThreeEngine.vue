<template>
  <div class="three-engine" ref="container" style="width:100%;height:100%;"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  EngineFactory
} from '@configbuilder/threeDEngine';

export default Vue.extend({
  name: 'ThreeEngine',

  props: {
    sceneJson: {
      type: [Object, String],
      default: null
    }
  },

  data() {
    return {};
  },

  mounted() {
    const container = this.$refs.container as HTMLElement;
    const comm = EngineFactory.create(container, this.sceneJson);
    this.$emit("ready", comm);
  },

  // beforeDestroy() {
  //   // cleanup events
  //   if (this.offSelected) this.offSelected();
  //   if (this.offHover) this.offHover();

  //   // gizmo cleanup
  //   if (this.gizmo?.dispose) {
  //     this.gizmo.dispose();
  //   }

  //   // adapter cleanup
  //   if (this.adapter?.dispose) {
  //     this.adapter.dispose();
  //   }

  //   // engine cleanup
  //   if (this.engine?.destroy) {
  //     this.engine.destroy();
  //   }
  // }
});
</script>

<style scoped>
.three-engine {
  position: relative;
}
</style>