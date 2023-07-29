import * as THREE from 'three'

function randRange (min, max) { return Math.floor(Math.random() * (max - min + 1) + min) }

function createBox (dimensions, position, params, scene, color = 0x00ff00) {
  const material = new THREE.MeshLambertMaterial({
    color
    // side: THREE.BackSide
  })
  const boxGeometry = new THREE.BoxGeometry(
    dimensions[0],
    dimensions[1],
    dimensions[2]
  )
  const mesh = new THREE.Mesh(boxGeometry, material)

  scene.add(mesh)
  mesh.position.x = position[0]
  mesh.position.y = position[1]
  mesh.position.z = position[2]

  return mesh
}

function createBall (radius, position, params, scene, color = 0x00ff00) {
  const material = new THREE.MeshLambertMaterial({
    color
    // side: THREE.BackSide
  })
  const boxGeometry = new THREE.SphereGeometry(
    radius
  )
  const mesh = new THREE.Mesh(boxGeometry, material)

  scene.add(mesh)
  mesh.position.x = position[0]
  mesh.position.y = position[1]
  mesh.position.z = position[2]

  return mesh
}

function makeHouse (position, facing, params, scene) {
  // lp = lightPole
  const outDepth = 0.01

  const houseWidth = 3
  const houseDepth = 3
  const houseHeight = randRange(params.houseHeight[0], params.houseHeight[1])

  const doorDepth = houseWidth / 5
  const doorHeight = 1.2
  const windowWidth = houseWidth / 5
  const windowHeight = houseWidth / 5

  // Body
  createBox(
    [houseWidth, houseHeight, houseDepth],
    [position[0], houseHeight / 2 + position[1], position[2]],
    params, scene, 0xff00ff
  )

  // Door
  createBox(
    [outDepth, doorHeight, doorDepth],
    [position[0] - houseDepth / 2 * facing, doorHeight / 2 + position[1], position[2]], params, scene,
    0x000000
  )

  // Windows
  createBox(
    [outDepth, windowHeight, windowWidth],
    [
      position[0] - houseDepth / 2 * facing,
      (3 * windowHeight) / 2 + position[1] - 0.1,
      position[2] + (houseWidth * 1.1) / 4
    ], params, scene,
    0x0000ff
  )
  createBox(
    [outDepth, windowHeight, windowWidth],
    [
      position[0] - houseDepth / 2 * facing,
      (3 * windowHeight) / 2 + position[1] - 0.1,
      position[2] - (houseWidth * 1.1) / 4
    ], params, scene,
    0x0000ff
  )
  const windowVerCount = 4
  const windowHorCount = 3
  for (let ii = 0; ii < windowHorCount; ii++) {
    for (let jj = 0; jj < windowVerCount; jj++) {
      createBox(
        [outDepth, windowHeight, windowWidth],
        [
          position[0] - houseDepth / 2 * facing,
          (windowHorCount * windowHeight) / 2 +
            position[1] - 0.1 + ((houseHeight * 0.9) / (windowVerCount + 1)) * (jj + 1),
          position[2] - ((houseWidth * 1.1) / (windowHorCount + 1)) * (ii - (windowHorCount - 1) * 0.5)
        ], params, scene,
        0x0000ff
      )
    }
  }
}

function createLight (position, params, scene) {
  const spotLight = new THREE.SpotLight(0xff00ff)
  spotLight.position.x = position[0]
  spotLight.position.y = position[1]
  spotLight.position.z = position[2]

  spotLight.intensity = 100

  spotLight.target.position.set(position[0], position[1] - 2, position[2])

  // spotLight.castShadow = true

  // spotLight.shadow.camera.near = 5
  // spotLight.shadow.camera.far = 400
  // spotLight.shadow.camera.fov = 30

  scene.add(spotLight)
  scene.add(spotLight.target)
}

function makeLightPole (position, params, scene) {
  // lp = lightPole
  const lpHeight = 2
  const lpTopLen = 0.4
  const wd = 0.1

  createBox(
    [wd, lpHeight, wd],
    [position[0], lpHeight / 2 + position[1], position[2]], params, scene,
    0xff0000
  )
  createBox(
    [lpTopLen, wd, wd],
    [wd / 2 - lpTopLen / 2 + position[0], lpHeight + position[1], position[2]], params, scene,
    0x0000ff
  )
  createLight([wd / 2 - lpTopLen + position[0], lpHeight + position[1] - 0.1, position[2]], params, scene)
}

function makeCity (params, scene) {
  const light = new THREE.AmbientLight(0x40f040)
  scene.add(light)

  // FLOOR
  createBox([params.mapWidth, params.planeWidth, params.mapLen], [0, 0, 0], params, scene, 0xff0000)

  // ROAD
  createBox([params.roadWidth, 0.01, params.mapLen], [0, 0.01, 0], params, scene, 0x0000f0)

  // Light pole count per side
  for (let ii = 0; ii < params.lpCount; ii++) {
    makeLightPole([
      params.roadWidth / 2 + 0.3,
      0,
      (params.mapLen / (params.lpCount - 1)) * ii - params.mapLen / 2
    ], params, scene)
    // makeLightPole([-0.8, 0, (mapLen / (lpCount - 1)) * ii - mapLen / 2]);
  }

  // Houses
  for (let ii = 0; ii < params.houseCount; ii++) {
    makeHouse([
      params.roadWidth / 2 + 2,
      params.planeWidth / 2,
      (params.mapLen / (params.houseCount - 1)) * ii - params.mapLen / 2
    ], 1, params, scene)
    makeHouse([
      -params.roadWidth / 2 - 2,
      params.planeWidth / 2,
      (params.mapLen / (params.houseCount - 1)) * ii - params.mapLen / 2
    ], -1, params, scene)
  }
}

function generateCity (params, scene) { makeCity(params, scene) }

export { generateCity, createBall, createBox }
