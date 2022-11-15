<template>
  <div class="scene" ref="sceneRef">
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as Three from 'three'
import scene from '@/three/scene'
import cameraModule from '@/three/camera'
import rendererModule from '@/three/renderer'
import animate from '@/three/animate'
import axes from '@/three/aexHelper'
import controlsModule from '@/three/controls'
import createdMesh from '../three/createMesh'
import '@/three/init'


const sceneRef = ref(null)
scene.add(cameraModule.activeCamera)
scene.add(axes)
createdMesh()
onMounted(() => {
  sceneRef.value.appendChild(rendererModule.renderer.domElement)
  animate()
})


</script>

<style lang="scss">
.scene {
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
}
</style>