import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

class Stencil {
  constructor () {
    let gui = false
    if (import.meta.env.MODE === 'development') gui = new GUI()

    this.clock = new THREE.Clock()
    this.scene = new THREE.Scene()
    this.object = new THREE.Group()
    this.planeObjects = []
    this.planes = [
      new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0),
      new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
      new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)
    ]
    this.planeHelpers = this.planes.map(p => new THREE.PlaneHelper(p, 2, 0xffffff))

    this.camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 1, 100)
    this.camera.position.set(2, 2, 2)

    this.scene.add(new THREE.AmbientLight(0xffffff, 1.5))

    const dirLight = new THREE.DirectionalLight(0xffffff, 3)
    dirLight.position.set(5, 10, 7.5)
    dirLight.castShadow = true
    dirLight.shadow.camera.right = 2
    dirLight.shadow.camera.left = -2
    dirLight.shadow.camera.top = 2
    dirLight.shadow.camera.bottom = -2

    dirLight.shadow.mapSize.width = 1024
    dirLight.shadow.mapSize.height = 1024
    this.scene.add(dirLight)

    this.planeHelpers.forEach(ph => {
      ph.visible = false
      this.scene.add(ph)
    })

    const geometry = new THREE.TorusKnotGeometry(0.4, 0.15, 220, 60)
    this.scene.add(this.object)

    // Set up clip plane rendering
    const planeGeom = new THREE.PlaneGeometry(4, 4)

    for (let i = 0; i < 3; i++) {
      const poGroup = new THREE.Group()
      const plane = this.planes[i]
      const stencilGroup = this.createPlaneStencilGroup(geometry, plane, i + 1)

      // plane is clipped by the other clipping planes
      const planeMat =
            new THREE.MeshStandardMaterial({

              color: 0xE91E63,
              metalness: 0.1,
              roughness: 0.75,
              clippingPlanes: this.planes.filter(p => p !== plane),

              stencilWrite: true,
              stencilRef: 0,
              stencilFunc: THREE.NotEqualStencilFunc,
              stencilFail: THREE.ReplaceStencilOp,
              stencilZFail: THREE.ReplaceStencilOp,
              stencilZPass: THREE.ReplaceStencilOp

            })
      const po = new THREE.Mesh(planeGeom, planeMat)
      po.onAfterRender = function (renderer) {
        renderer.clearStencil()
      }

      po.renderOrder = i + 1.1

      this.object.add(stencilGroup)
      poGroup.add(po)
      this.planeObjects.push(po)
      this.scene.add(poGroup)
    }

    const material = new THREE.MeshStandardMaterial({

      color: 0xFFC107,
      metalness: 0.1,
      roughness: 0.75,
      clippingPlanes: this.planes,
      clipShadows: true,
      shadowSide: THREE.DoubleSide

    })

    // add the color
    const clippedColorFront = new THREE.Mesh(geometry, material)
    clippedColorFront.castShadow = true
    clippedColorFront.renderOrder = 6
    this.object.add(clippedColorFront)

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 9, 1, 1),
      new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.25, side: THREE.DoubleSide })
    )

    ground.rotation.x = -Math.PI / 2 // rotates X/Y to X/Z
    ground.position.y = -1
    ground.receiveShadow = true
    this.scene.add(ground)

    // GUI
    if (gui) {
      gui.add(params, 'animate')

      const planeX = gui.addFolder('planeX')
      planeX.add(params.planeX, 'displayHelper').onChange(v => (this.planeHelpers[0].visible = v))
      planeX.add(params.planeX, 'constant').min(-1).max(1).onChange(d => (this.planes[0].constant = d))
      planeX.add(params.planeX, 'negated').onChange(() => {
        this.planes[0].negate()
        params.planeX.constant = this.planes[0].constant
      })
      planeX.open()

      const planeY = gui.addFolder('planeY')
      planeY.add(params.planeY, 'displayHelper').onChange(v => (this.planeHelpers[1].visible = v))
      planeY.add(params.planeY, 'constant').min(-1).max(1).onChange(d => (this.planes[1].constant = d))
      planeY.add(params.planeY, 'negated').onChange(() => {
        this.planes[1].negate()
        params.planeY.constant = this.planes[1].constant
      })
      planeY.open()

      const planeZ = gui.addFolder('planeZ')
      planeZ.add(params.planeZ, 'displayHelper').onChange(v => (this.planeHelpers[2].visible = v))
      planeZ.add(params.planeZ, 'constant').min(-1).max(1).onChange(d => (this.planes[2].constant = d))
      planeZ.add(params.planeZ, 'negated').onChange(() => {
        this.planes[2].negate()
        params.planeZ.constant = this.planes[2].constant
      })
      planeZ.open()
    }
  }

  get getCamera () {
    return this.camera
  }

  get getScene () {
    return this.scene
  }

  createPlaneStencilGroup (geometry, plane, renderOrder) {
    const group = new THREE.Group()
    const baseMat = new THREE.MeshBasicMaterial()
    baseMat.depthWrite = false
    baseMat.depthTest = false
    baseMat.colorWrite = false
    baseMat.stencilWrite = true
    baseMat.stencilFunc = THREE.AlwaysStencilFunc

    // back faces
    const mat0 = baseMat.clone()
    mat0.side = THREE.BackSide
    mat0.clippingPlanes = [plane]
    mat0.stencilFail = THREE.IncrementWrapStencilOp
    mat0.stencilZFail = THREE.IncrementWrapStencilOp
    mat0.stencilZPass = THREE.IncrementWrapStencilOp

    const mesh0 = new THREE.Mesh(geometry, mat0)
    mesh0.renderOrder = renderOrder
    group.add(mesh0)

    // front faces
    const mat1 = baseMat.clone()
    mat1.side = THREE.FrontSide
    mat1.clippingPlanes = [plane]
    mat1.stencilFail = THREE.DecrementWrapStencilOp
    mat1.stencilZFail = THREE.DecrementWrapStencilOp
    mat1.stencilZPass = THREE.DecrementWrapStencilOp

    const mesh1 = new THREE.Mesh(geometry, mat1)
    mesh1.renderOrder = renderOrder

    group.add(mesh1)

    return group
  }

  animate () {
    const delta = this.clock.getDelta()
    if (params.animate) {
      this.object.rotation.x += delta * 0.5
      this.object.rotation.y += delta * 0.2
    }

    for (let i = 0; i < this.planeObjects.length; i++) {
      const plane = this.planes[i]
      const po = this.planeObjects[i]
      plane.coplanarPoint(po.position)
      po.lookAt(
        po.position.x - plane.normal.x,
        po.position.y - plane.normal.y,
        po.position.z - plane.normal.z
      )
    }
  }
}

export { Stencil }

const params = {

  animate: true,
  planeX: {

    constant: 0,
    negated: false,
    displayHelper: false

  },
  planeY: {

    constant: 0,
    negated: false,
    displayHelper: false

  },
  planeZ: {

    constant: 0,
    negated: false,
    displayHelper: false

  }

}
