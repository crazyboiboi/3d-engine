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
  mounted() {
    const container = this.$refs.container as HTMLElement;
    const comm = EngineFactory.create(container, this.sceneJson);
    this.$emit("ready", comm);
  }
});
</script>

<style scoped>
.three-engine {
  position: relative;
}
</style>