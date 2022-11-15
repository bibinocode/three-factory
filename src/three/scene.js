import * as Three from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
const scene = new Three.Scene()

const rgbloader = new RGBELoader()
rgbloader.loadAsync('./textures/2k.hdr').then(texture => {
  scene.background = texture
  scene.environment = texture
  // 映射改为圆柱体映射
  scene.environment.mapping = Three.EquirectangularReflectionMapping
})

const light = new Three.DirectionalLight(0xffffff, 1)
light.position.set(10, 100, 10)
scene.add(light)

export default scene