import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
import cameraModule from './camera'
import rendererModule from './renderer'
import eventHub from '../utils/eventHub'
class ControlsModule {
  constructor() {
    this.controls = null
    this.setOrbitControls() // 默认轨道控制器
    eventHub.on('toggleControls', (name) => {
      this[`set${name}Controls`]()
    })
  }
  setOrbitControls () { // 轨道控制器
    this.controls = new OrbitControls(cameraModule.activeCamera, rendererModule.renderer.domElement)
    this.controls.enableDamping = true
    // 最小垂直角度
    // this.controls.maxPolarAngle = Math.PI / 2
    this.controls.minPolarAngle = 0
  }
  setFlyControls () {
    this.controls = new FlyControls(cameraModule.activeCamera, rendererModule.renderer.domElement)
    // 设置飞行速度
    this.controls.movementSpeed = 100
    // 设置飞行角度
    this.controls.rollSpeed = Math.PI / 60
  }
  setFirstPersonControls () {
    this.controls = new FirstPersonControls(cameraModule.activeCamera, rendererModule.renderer.domElement)
    this.controls.movementSpeed = 100
  }
}



export default new ControlsModule()