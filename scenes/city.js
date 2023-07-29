import * as THREE from 'three'

class City {
  get getCamera () {
    return this.camera
  }

  get getScene () {
    return this.scene
  }

  createBox (dimensions, position, color = 0x00ff00) {
    const material = new THREE.MeshBasicMaterial({
      color,
      side: THREE.BackSide
    })
    const boxGeometry = new THREE.BoxGeometry(
      dimensions[0],
      dimensions[1],
      dimensions[2]
    )
    const mesh = new THREE.Mesh(boxGeometry, material)

    this.scene.add(mesh)
    mesh.position.x = position[0]
    mesh.position.y = position[1]
    mesh.position.z = position[2]

    return mesh
  }

  randRange (min, max) { return Math.floor(Math.random() * (max - min + 1) + min) }

  // Facing: 1 = windows at right, -1 = windows at left
  makeHouse (position, facing) {
    // lp = lightPole
    const outDepth = 0.01

    const houseWidth = 3
    const houseDepth = 3
    const houseHeight = this.randRange(5, 12)

    const doorDepth = houseWidth / 5
    const doorHeight = 1.2
    const windowWidth = houseWidth / 5
    const windowHeight = houseWidth / 5

    // Body
    this.createBox(
      [houseWidth, houseHeight, houseDepth],
      [position[0], houseHeight / 2 + position[1], position[2]],
      0xff00ff
    )

    // Door
    this.createBox(
      [outDepth, doorHeight, doorDepth],
      [position[0] - houseDepth / 2 * facing, doorHeight / 2 + position[1], position[2]],
      0x000000
    )

    // Windows
    this.createBox(
      [outDepth, windowHeight, windowWidth],
      [
        position[0] - houseDepth / 2 * facing,
        (3 * windowHeight) / 2 + position[1] - 0.1,
        position[2] + (houseWidth * 1.1) / 4
      ],
      0x0000ff
    )
    this.createBox(
      [outDepth, windowHeight, windowWidth],
      [
        position[0] - houseDepth / 2 * facing,
        (3 * windowHeight) / 2 + position[1] - 0.1,
        position[2] - (houseWidth * 1.1) / 4
      ],
      0x0000ff
    )
    const windowVerCount = 4
    const windowHorCount = 3
    for (let ii = 0; ii < windowHorCount; ii++) {
      for (let jj = 0; jj < windowVerCount; jj++) {
        this.createBox(
          [outDepth, windowHeight, windowWidth],
          [
            position[0] - houseDepth / 2 * facing,
            (windowHorCount * windowHeight) / 2 +
            position[1] - 0.1 + ((houseHeight * 0.9) / (windowVerCount + 1)) * (jj + 1),
            position[2] - ((houseWidth * 1.1) / (windowHorCount + 1)) * (ii - (windowHorCount - 1) * 0.5)
          ],
          0x0000ff
        )
      }
    }
  }

  makeLightPole (position) {
    // lp = lightPole
    const lpHeight = 2
    const lpTopLen = 0.4
    const wd = 0.1

    this.createBox(
      [wd, lpHeight, wd],
      [position[0], lpHeight / 2 + position[1], position[2]],
      0xff0000
    )
    this.createBox(
      [lpTopLen, wd, wd],
      [wd / 2 - lpTopLen / 2 + position[0], lpHeight + position[1], position[2]],
      0x0000ff
    )
  }

  makeCity () {
    //   const light = new THREE.AmbientLight(0x40f040);
    //   scene.add(light);

    // FLOOR
    this.createBox([params.mapWidth, params.planeWidth, params.mapLen], [0, 0, 0])

    // ROAD
    this.createBox([params.roadWidth, 0.01, params.mapLen], [0, 0.01, 0], 0x0000f0)

    // Light pole count per side
    for (let ii = 0; ii < params.lpCount; ii++) {
      this.makeLightPole([
        params.roadWidth / 2 + 0.3,
        0,
        (params.mapLen / (params.lpCount - 1)) * ii - params.mapLen / 2
      ])
      // makeLightPole([-0.8, 0, (mapLen / (lpCount - 1)) * ii - mapLen / 2]);
    }

    // Houses
    for (let ii = 0; ii < params.houseCount; ii++) {
      this.makeHouse([
        params.roadWidth / 2 + 2,
        params.planeWidth / 2,
        (params.mapLen / (params.houseCount - 1)) * ii - params.mapLen / 2
      ], 1)
      this.makeHouse([
        -params.roadWidth / 2 - 2,
        params.planeWidth / 2,
        (params.mapLen / (params.houseCount - 1)) * ii - params.mapLen / 2
      ], -1)
    }
  }

  constructor (gui = false) {
    // const cameraPos = [0, 5, 20]
    // const cameraPos = [-6, 0, 12.5]
    // const cameraLookat = [0, -Math.PI / 2, 0]
    // const cameraLookat = [0, 0, 0]

    this.scene = new THREE.Scene()

    // Init camera (PerspectiveCamera)
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )

    // Init renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })

    // Set size (whole window)
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.makeCity()
    this.camera.position.x = params.cameraPos[0]
    this.camera.position.y = params.cameraPos[1]
    this.camera.position.z = params.cameraPos[2]

    this.camera.rotation.x = params.cameraLookat[0]
    this.camera.rotation.y = params.cameraLookat[1]
    this.camera.rotation.z = params.cameraLookat[2]

    document.body.addEventListener('keydown', (event) => {
      console.log(event.key)
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
    if (params.controls) {
      this.camera.position.x += params.camSpeedModifier[0] * params.camSpeed
      this.camera.position.z += params.camSpeedModifier[1] * params.camSpeed
      this.camera.position.y += params.camSpeedModifier[2] * params.camSpeed
    } else {
      this.camera.position.z -= params.camSpeed
      params.camSpeed *= 1.01
    }
    // this.camera.rotation.y += 0.01
  }
}

export { City }

const params = {
  controls: false,
  initV2: true,
  cameraPos: [0, 1, 250],
  // cameraLookat: [0, Math.PI / 2, 0],
  cameraLookat: [0, 0, 0],
  camSpeed: 0.1,
  camSpeedModifier: [0, 0, 0],

  roadWidth: 2,
  mapLen: 500,
  mapWidth: 10,
  planeWidth: 0.01,

  houseCount: 100,
  lpCount: 40
}
