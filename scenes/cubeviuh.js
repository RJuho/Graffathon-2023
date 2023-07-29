import * as THREE from 'three'

class CubeViuh {
  constructor () {
    this.scene = new THREE.Scene()
    this.clock = new THREE.Clock();

    this.camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 1, 100)
    this.camera.position.set(-20, -20, -20)

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x112233 } );
    const mesh = new THREE.Mesh( geometry, material );

    const keyframes = new THREE.VectorKeyframeTrack( '.position', [ 0, 1, 2 ,3,4,5,6], [
      1, 0, 0,
      3, 10, 0,
      3, 0, 0,
     -3, 0, 0,
      0, 0, 0,
      0, 3, 3,
      3, 3, 3
    ] );

    const xAxis = new THREE.Vector3( 1, 1, 2 );
    const spinStart = new THREE.Quaternion().setFromAxisAngle( xAxis, 0 );
    const spinEnd = new THREE.Quaternion().setFromAxisAngle( xAxis, 3);
    const spinKeyframes = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 1, 2 ], [ spinStart.x, spinStart.y, spinStart.z, spinStart.w, spinEnd.x, spinEnd.y, spinEnd.z, spinEnd.w, spinStart.x, spinStart.y, spinStart.z, spinStart.w ] );

    this.mixer = new THREE.AnimationMixer( mesh );
    const clip = new THREE.AnimationClip( 'Animation', 20, [ keyframes, spinKeyframes ] );
    const clipAction = this.mixer.clipAction( clip );
    clipAction.play();

    this.scene.add(mesh);

    this.scene.add(new THREE.AmbientLight(0xffffff, 1.5))
  }

  get getCamera () {
    return this.camera
  }

  get getScene () {
    return this.scene
  }


  animate () {
    const delta = this.clock.getDelta();

    this.mixer.update( delta );
  }
}

export { CubeViuh }
