// IMPORTANT
// HIDE CURSOR AFTER START
// ADD SOUND
// AUTOMATICALLY GO TO FULL SCREEN

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'

import { Stencil } from './scenes/stencil'
import { Explosion } from './scenes/explosion'
import { CityAtStreetLevel } from './scenes/cityAtStreetLevel'
import { CityFromWindow } from './scenes/cityFromWindow'
// import { StencilBLue } from './scenes/stencil-blue'
import song from './assets/music/smoke-143172-cut.mp3'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
// import { Credits } from './scenes/credits'
import { Viuh } from './scenes/viuh'
let scene, scenes, renderer, stats, composer

init()

function init () {
  scenes = [
    {
      scene: new Viuh(),
      time: 50
    },
    {
      scene: new CityAtStreetLevel(),
      time: 10
    },
    {
      scene: new Explosion()
    }]

  // Stats
  stats = new Stats()

  const music = new window.Audio(song)

  const loop = i => {
    scene = scenes[i].scene

    const controls = new OrbitControls(scene.getCamera, renderer.domElement)
    controls.minDistance = 2
    controls.maxDistance = 20
    controls.enabled = false
    controls.update()

    composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scenes[i].scene.getScene, scenes[i].scene.getCamera))
    scenes[i].scene.getEffectShaders.forEach(shaderPass => {
      composer.addPass(shaderPass)
    })

    const outputPass = new OutputPass()
    composer.addPass(outputPass)

    if (!scenes[i]?.time) return

    setTimeout(() => {
      loop(i + 1)
    }, scenes[i].time)
  }

  const welcomeGUI = new GUI()
  welcomeGUI.hide()

  const settings = {
    fullScreen: true,
    music: true,
    stats: true,
    antialias: false,
    checkShaderErrors: false,
    pixelRatio: Number((window.devicePixelRatio * 0.70).toFixed(1)),
    start: () => {
      welcomeGUI.hide()
      document.body.style.cursor = 'none'

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: settings.antialias })
      renderer.debug = { checkShaderErrors: settings.checkShaderErrors }
      renderer.shadowMap.enabled = true
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x263238)

      window.addEventListener('resize', onWindowResize)
      document.body.appendChild(renderer.domElement)

      renderer.localClippingEnabled = true

      // Show or hide stats
      if (settings.stats) document.body.appendChild(stats.dom)

      renderer.setPixelRatio(settings.pixelRatio)

      if (settings.fullScreen) {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen()
        } else if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }

      if (settings.music) {
        music.play()
        music.addEventListener('playing', () => {
          loop(0)
          animate()
        })
        return
      }

      loop(0)
      animate()
    }
  }

  welcomeGUI.add(settings, 'antialias')
  welcomeGUI.add(settings, 'fullScreen')
  welcomeGUI.add(settings, 'music')
  welcomeGUI.add(settings, 'stats')
  welcomeGUI.add(settings, 'checkShaderErrors')
  welcomeGUI.add(settings, 'pixelRatio', 0.1, window.devicePixelRatio, 0.1)
  welcomeGUI.add(settings, 'start')

  music.addEventListener('canplaythrough', () => {
    welcomeGUI.show()
  })
  music.addEventListener('ended', () => {
    welcomeGUI.show()
  })
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
  composer.render(scene.getScene, scene.getCamera)
  stats.end()
}
