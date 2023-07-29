// IMPORTANT
// HIDE CURSOR AFTER START
// ADD SOUND
// AUTOMATICALLY GO TO FULL SCREEN

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'

import { Stencil } from './scenes/stencil'
import { CityAtStreetLevel } from './scenes/cityAtStreetLevel'
import { CubeViuh } from './scenes/cubeviuh'
// import { StencilBLue } from './scenes/stencil-blue'

let scene, scenes, renderer, stats

init()
animate()

function init () {
  scenes = [{
    scene: new Stencil(),
    time: 50
  },
  {
    scene: new CubeViuh(),
    time: 50
  },
  {
    scene: new CityAtStreetLevel()
  }]

  // Stats
  stats = new Stats()
  document.body.appendChild(stats.dom)

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.shadowMap.enabled = true
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x263238)

  window.addEventListener('resize', onWindowResize)
  document.body.appendChild(renderer.domElement)

  renderer.localClippingEnabled = true

  const loop = i => {
    scene = scenes[i].scene

    const controls = new OrbitControls(scene.getCamera, renderer.domElement)
    controls.minDistance = 2
    controls.maxDistance = 20
    controls.enabled = false
    controls.update()

    if (!scenes[i]?.time) return

    setTimeout(() => {
      loop(i + 1)
    }, scenes[i].time)
  }

  loop(0)
}

function onWindowResize () {
  scene.getCamera.aspect = window.innerWidth / window.innerHeight
  scene.getCamera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate () {
  window.requestAnimationFrame(animate)

  scene.animate()

  stats.begin()
  renderer.render(scene.getScene, scene.getCamera)
  stats.end()
}
