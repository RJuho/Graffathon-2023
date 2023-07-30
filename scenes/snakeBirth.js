import * as THREE from 'three'
import { createBall, createBox } from './generateCity'

class SnakeBirth {
  get getCamera () {
    return this.camera
  }

  get getScene () {
    return this.scene
  }

  get getEffectShaders () {
    return []
  }

  randRange (min, max) { return Math.floor(Math.random() * (max - min + 1) + min) }

  constructor (gui = false) {
    // const cameraPos = [0, 5, 20]
    // const cameraPos = [-6, 0, 12.5]
    // const cameraLookat = [0, -Math.PI / 2, 0]
    // const cameraLookat = [0, 0, 0]

    this.scene = new THREE.Scene()
    this.clock = new THREE.Clock()

    this.light = new THREE.AmbientLight(0xffffff) // soft white light
    this.scene.add(this.light)

    // Init camera (PerspectiveCamera)
    this.camera = new THREE.PerspectiveCamera(
      75,
      1 * window.innerWidth / window.innerHeight,
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

    this.floor = createBox(params.floorDim, params.floorPos, params, this.scene, 0xff00ff)
    this.balls = Array(params.ballCount)
    for (let ii = 0; ii < params.ballCount; ii++) {
      this.balls[ii] = createBall(params.ballRadius, [0, params.ballRadius, 0], params, this.scene, 0x00ff00)
    }

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

    this.curTime = this.clock.getElapsedTime()
    for (let ii = 0; ii < params.ballCount; ii++) {
    //   console.log(this.balls)
      if (this.curTime * params.speed - ii * params.ballSpacing > 0) {
        this.balls[ii].position.z = -(this.curTime * params.speed - ii * params.ballSpacing) * 2

        this.balls[ii].position.x = Math.sin(2 * (this.curTime * params.speed - ii * params.ballSpacing))
      }
    }

    if (params.controls) {
      this.camera.position.x += params.camSpeedModifier[0] * params.camSpeed
      this.camera.position.z += params.camSpeedModifier[1] * params.camSpeed
      this.camera.position.y += params.camSpeedModifier[2] * params.camSpeed
    }
  }
}

export { SnakeBirth }

const params = {
  //   controls: false,
  controls: true,
  initV2: true,
  //   cameraPos: [-1.85, 5, 8.5],
  cameraPos: [0, 5, -2],
  //   cameraLookat: [0, Math.PI / 2, 0],
  cameraLookat: [-Math.PI / 2, 0, 0],
  //   cameraLookat: [-Math.PI / 2, 0, 0],
  camSpeed: 0.1,
  camRotSpeed: 0.018,
  camSpeedModifier: [0, 0, 0],

  speed: 0.5,

  ballCount: 5,
  ballRadius: 0.3,
  ballSpacing: 0.2,

  floorDim: [20, 0.01, 20],
  floorPos: [0, 0, 0]
}
