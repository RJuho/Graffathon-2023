import * as THREE from 'three'
import { generateCity } from './generateCity'

class CityAtStreetLevel {
  get getCamera () {
    return this.camera
  }

  get getScene () {
    return this.scene
  }

  constructor (gui = false) {
    // const cameraPos = [0, 5, 20]
    // const cameraPos = [-6, 0, 12.5]
    // const cameraLookat = [0, -Math.PI / 2, 0]
    // const cameraLookat = [0, 0, 0]

    this.scene = new THREE.Scene()
    this.clock = new THREE.Clock()

    // Init camera (PerspectiveCamera)
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )

    // this.light = new THREE.DirectionalLight(0xffffff, 3)
    // this.light.position.set(0, 5, 0)
    // this.createBox([0.1, 0.1, 0.1], [0, 4, 0])
    // this.scene.add(this.light)

    // Init renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })

    // Set size (whole window)
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    generateCity(params, this.scene)
    generateCity.bind(this)

    this.camera.position.x = params.cameraPos[0]
    this.camera.position.y = params.cameraPos[1]
    this.camera.position.z = params.cameraPos[2]

    this.camera.rotation.x = params.cameraLookat[0]
    this.camera.rotation.y = params.cameraLookat[1]
    this.camera.rotation.z = params.cameraLookat[2]

    document.body.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'ArrowRight':
          params.camSpeedModifier[0] = 1
          break
        case 'ArrowLeft':
          params.camSpeedModifier[0] = -1
          break
        case 'ArrowUp':
          params.camSpeedModifier[1] = -1
          break
        case 'ArrowDown':
          params.camSpeedModifier[1] = 1
          break
        case 'PageUp':
          params.camSpeedModifier[2] = 1
          break
        case 'PageDown':
          params.camSpeedModifier[2] = -1
          break
      }
      // do something
    })
    document.body.addEventListener('keyup', (event) => {
      switch (event.code) {
        case 'ArrowRight':
          params.camSpeedModifier[0] = 0
          break
        case 'ArrowLeft':
          params.camSpeedModifier[0] = 0
          break
        case 'ArrowUp':
          params.camSpeedModifier[1] = 0
          break
        case 'ArrowDown':
          params.camSpeedModifier[1] = 0
          break
        case 'PageUp':
          params.camSpeedModifier[2] = 0
          break
        case 'PageDown':
          params.camSpeedModifier[2] = 0
          break
      }
      // do something
    })
  }

  animate () {
    if (params.initV2) {
      params.initV2 = false
      this.camera.rotation.x = params.cameraLookat[0]
      this.camera.rotation.y = params.cameraLookat[1]
      this.camera.rotation.z = params.cameraLookat[2]

      this.camera.position.x = params.cameraPos[0]
      this.camera.position.y = params.cameraPos[1]
      this.camera.position.z = params.cameraPos[2]
    }
    // console.log(this.clock.getElapsedTime())
    if (params.controls) {
      this.camera.position.x += params.camSpeedModifier[0] * params.camSpeed
      this.camera.position.z += params.camSpeedModifier[1] * params.camSpeed
      this.camera.position.y += params.camSpeedModifier[2] * params.camSpeed
    } else {
      const curTime = this.clock.getElapsedTime()
      this.camera.position.z = -curTime * 4
      this.camera.position.x = Math.sin(curTime)
      // this.camera.position.y = Math.cos(curTime) + 1.1
    }
    // this.camera.rotation.y += 0.01
  }
}

export { CityAtStreetLevel }

const params = {
  controls: false,
  // controls: true,
  initV2: true,
  cameraPos: [0, 0.5, 250],
  // cameraLookat: [0, Math.PI / 2, 0],
  cameraLookat: [0, 0, 0],
  camSpeed: 0.1,
  camRotSpeed: 0.018,
  camSpeedModifier: [0, 0, 0],

  houseHeight: [5, 10],
  roadWidth: 3,
  mapLen: 500,
  mapWidth: 10,
  planeWidth: 0.01,

  houseCount: 100,
  lpCount: 20
}
