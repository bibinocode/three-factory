import * as Three from 'three'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'
import eventHub from '../../utils/eventHub'
import CameraModule from '../camera'
import vertexShader from '@/shader/fighter/vertexShader.glsl'
import fragmentShader from '@/shader/fighter/fragmentShader.glsl'
export default class City {
  constructor(scene) {
    this.floor1Group;
    this.floor2Group;
    this.wallGroup;
    this.tagsGroup = [];
    this.fighterGroup
    this.fighterPointsGroup
    // 载入模型
    this.scene = scene
    this.loader = new GLTFLoader()
    // 设置解压加载器
    const dracoloader = new DRACOLoader()
    // 解压loader解析路径 告诉怎么进行解压的路径 需要将解压的文件夹draco复制到自己项目
    // node_modules\three\examples\js\libs
    dracoloader.setDecoderPath("./draco/")
    dracoloader.setDecoderConfig({ type: "js" })
    dracoloader.preload()
    this.loader.setDRACOLoader(dracoloader)
    this.loader.load('./model/floor2.glb', gltf => {
      this.floor2Group = gltf.scene

      gltf.scene.traverse(child => {
        if (child.isMesh) {
          child.material.emissiveIntensity = 15; // 更改所有物体发光强度
          // child.material.side = Three.DoubleSide
        }
        if (child.type === 'Object3D' && child.children.length === 0) {
          const object3d = this.createTag(child)
          object3d.visible = false
          this.tagsGroup.push(object3d)
          this.floor2Group.add(object3d)
        }
      })
      this.floor2Group.visible = false
      scene.add(gltf.scene)
    })
    // 工厂外形
    this.loader.load('./model/wall.glb', gltf => {
      this.wallGroup = gltf.scene
      scene.add(gltf.scene)
    })
    this.loader.load('./model/floor1.glb', gltf => {
      this.floor1Group = gltf.scene
      this.floor1Group.visible = false
      scene.add(gltf.scene)
    })
    this.raycaster = new Three.Raycaster()
    this.mouse = new Three.Vector2()
    // 加载飞机
    this.loader.load('./model/Fighter.glb', gltf => {
      this.fighterGroup = gltf.scene
      gltf.scene.traverse(child => {
        if (child.isMesh) {
          child.material.emissiveIntensity = 10
        }
      })

      this.fighterGroup.visible = false
      this.fighterGroup.position.set(3, 45, 68)
      this.scene.add(gltf.scene)
    })

    this.initEvent()
    window.addEventListener('click', (event) => {
      // 将鼠标位置进行归一化转为设备坐标, x 和 y方向的取值范围是（-1 to +1）
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      this.mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)
      // 通过摄像机和鼠标位置更新射线
      this.raycaster.setFromCamera(this.mouse, CameraModule.activeCamera)
      // 进行检测
      const intersects = this.raycaster.intersectObject(this.fighterGroup)
      // 查看检测
      if (intersects.length > 0) {
        // 点击战斗机反复切换二楼显示
        if (this.floor2Group.visible) {
          this.floor2Group.visible = false
          this.tagsGroup.forEach(item => item.visible = false)
        } else {
          this.floor2Group.visible = true
          this.tagsGroup.forEach(item => item.visible = true)
        }
      }
    })
  }
  createTag (object) {
    const element = document.createElement('div')
    element.className = "elementTag"
    element.innerHTML = `
      <div class="elementContent">
        <h3>${object.name}</h3>
        <p>温度：26°</p>
        <p>湿度：50%</p>
      </div>
    `
    const css3dRender = new CSS3DObject(element)
    css3dRender.scale.set(0.2, 0.2, 0.2)
    css3dRender.position.copy(object.position)
    return css3dRender
  }
  hideFloor1 () {
    this.floor1Group.visible = false
  }
  hideFloor2 () {
    this.tagsGroup.forEach(item => item.visible = false)
    this.floor2Group.visible = false
    this.fighterGroup.visible = false
  }
  hideWall () {
    this.wallGroup.visible = false
  }
  showFloor1 () {
    this.floor1Group.visible = true
  }
  showFloor2 () {
    this.tagsGroup.forEach(item => item.visible = true)
    this.floor2Group.visible = true
    this.fighterGroup.visible = true
  }
  showWall () {
    this.wallGroup.visible = true
  }
  showPonitsEffects () {
    this.hideFloor1()
    this.hideFloor2()
    this.hideWall()
    this.fighterGroup.visible = true
  }
  initEvent () {
    eventHub.on("showFloor1", () => {
      this.showFloor1()
      this.hideWall()
      this.hideFloor2()
    })
    eventHub.on("showFloor2", () => {
      this.showFloor2()
      this.hideFloor1()
      this.hideWall()
    })
    eventHub.on("showWall", () => {
      this.showWall()
      this.hideFloor1()
      this.hideFloor2()
    })
    eventHub.on("showAll", () => {
      this.showFloor1()
      this.showFloor2()
      this.showWall()
      gsap.to(this.wallGroup.position, {
        y: 150,
        duration: 2
      })
      gsap.to(this.floor2Group.position, {
        y: 50,
        duration: 1,
        delay: 1
      })
    })
    eventHub.on("hideAll", () => {
      gsap.to(this.wallGroup.position, {
        y: 0,
        duration: 1,
        delay: 1,
        onComplete: () => {
          // 外墙回去后，再隐藏其他的楼层
          this.hideFloor2()
          this.hideFloor1()
        }
      })
      gsap.to(this.floor2Group.position, {
        y: 0,
        duration: 1,
      })
    })

    // 展开飞机
    eventHub.on("expand", () => {
      // 准备点数组
      const position = []
      for (let i = 0; i < 5; i++) {
        for (let k = 0; k < 5; k++) {
          // 往点数组内推入点数据
          position.push(new Three.Vector3(i * 2 - 4, 0, k * 2 - 4))
        }
      }
      let n = 0
      // 遍历飞机模型
      this.fighterGroup.traverse(child => {
        if (child.isMesh) {
          // 先将向量放大
          position[n].multiplyScalar(20)
          child.position2 = child.position.clone()
          // 然后动画进行位置更换
          gsap.to(child.position, {
            x: position[n].x,
            y: position[n].y,
            z: position[n].z,
            duration: 1
          })
          n++
        }
      })
    })
    // 飞机复原
    eventHub.on("recover", () => {
      this.fighterGroup.traverse(child => {
        if (child.isMesh) {
          gsap.to(child.position, {
            x: child.position2.x,
            y: child.position.y,
            z: child.position.z,
            duration: 1
          })
        }
      })
    })
    // 粒子特效
    eventHub.on("pointEffects", () => {
      this.showPonitsEffects()
      this.createPoints(this.fighterGroup)
      this.fighterGroup.visible = false
    })
    // 粒子爆炸
    eventHub.on("pointBlast", () => {
      this.pointBlast()
    })
    // 粒子复原
    eventHub.on("pointBack", () => {
      this.pointBack()
    })
  }
  createPoints (object3d) {
    // 没有这个点数组才去生成,避免消耗性能
    if (!this.fighterPointsGroup) {
      this.fighterPointsGroup = this.transformPoints(object3d)
      this.scene.add(this.fighterPointsGroup)
    }
  }
  transformPoints (object3d) {
    // 创建一个组
    const group = new Three.Group()
    function createPoint (object3d, newGroup) {
      if (object3d.children.length > 0) {
        object3d.children.forEach(child => {
          if (child.isMesh) {
            const texture = new Three.TextureLoader().load("/assets/particles/1.png")
            const colors = new Three.Color(Math.random(), Math.random(), Math.random())
            const material = new Three.ShaderMaterial({
              uniforms: {
                uColor: {
                  value: colors
                },
                uTexture: {
                  value: texture
                },
                uTime: {
                  value: 0
                }
              },
              vertexShader: vertexShader,
              fragmentShader: fragmentShader,
              depthTest: false,
              transparent: true,
              blending: Three.AdditiveBlending,
            })
            // const material = new Three.PointsMaterial({
            //   color: colors,
            //   size: 0.1,
            //   map: texture,
            //   blending: Three.AdditiveBlending,
            //   transparent: true,
            //   depthTest: false,
            // })
            // 创建点物体
            const pointsCube = new Three.Points(child.geometry, material)
            pointsCube.position.copy(child.position)
            pointsCube.rotation.copy(child.rotation)
            pointsCube.scale.copy(child.scale)
            newGroup.add(pointsCube)
            createPoint(child, pointsCube)
          }
        })
      }
    }
    // 递归调用
    createPoint(object3d, group)
    return group
  }
  // 粒子爆炸
  pointBlast () {
    // 遍历飞机模型的点
    this.fighterPointsGroup.traverse(child => {
      if (child.isPoints) {
        // 如果是点的话，获取几何体顶点的数量 * 3来准备随机位置数组
        let randomPoinstionArr = new Float32Array(child.geometry.attributes.position.count * 3)
        // 遍历生成位置
        for (let i = 0; i < child.geometry.attributes.position.count; i++) {
          // 随机 -10 to +10 的位置
          randomPoinstionArr[i * 3 + 0] = (Math.random() * 2 - 1) * 10
          randomPoinstionArr[i * 3 + 1] = (Math.random() * 2 - 1) * 10
          randomPoinstionArr[i * 3 + 2] = (Math.random() * 2 - 1) * 10
        }
        // 然后传递uniform
        child.geometry.setAttribute("aPosition", new Three.BufferAttribute(randomPoinstionArr, 3))
        // 传递uTime
        gsap.to(child.material.uniforms.uTime, {
          value: 10,
          duration: 10
        })
      }
    })
  }
  // 粒子复原
  pointBack () {
    this.fighterPointsGroup.traverse(child => {
      if (child.isPoints) {
        gsap.to(child.material.uniforms.uTime, {
          value: 0,
          duration: 10
        })
      }
    })
  }
}
