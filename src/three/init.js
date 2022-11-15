
import cameraModule from "./camera"
import rendererModule from "./renderer"

window.addEventListener('resize', () => {
  //   console.log("resize");
  // 更新摄像头
  cameraModule.activeCamera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  cameraModule.activeCamera.updateProjectionMatrix();

  //   更新渲染器
  rendererModule.renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比例
  rendererModule.renderer.setPixelRatio(window.devicePixelRatio);
  rendererModule.css3dRender.setSize(window.innerWidth, window.innerHeight)
})
