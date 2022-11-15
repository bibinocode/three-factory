import * as Three from 'three'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'
const renderer = new Three.WebGLRenderer({
  // 抗锯齿
  antialias: false,
  // depbuffer
  logarithmicDepthBuffer: true,
  physicallyCorrectLights: true // 物理光照
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true;
// 设置曝光模式
renderer.toneMapping = Three.ACESFilmicToneMapping
// 设置曝光程度
renderer.toneMappingExposure = 0.8

const css3dRender = new CSS3DRenderer()
css3dRender.setSize(window.innerWidth, window.innerHeight)
document.querySelector('#cssrender').appendChild(css3dRender.domElement)

export default { renderer, css3dRender }