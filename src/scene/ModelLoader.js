import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { scene, setModel } from './SceneSetup.js'
import { onLoadComplete, updateLoadingBar } from '../ui/LoadingScreen.js'

const MODEL_URL = 'https://raw.githubusercontent.com/hoangtra02092006-ui/3D-Porches-File/main/Meshy_AI_A_sleek_Porsche_911_G_0603064402_texture.glb'

// Desired WORLD-SPACE positions for each marker.
// After centering/scaling, the car sits roughly inside x:±1, y:0-1, z:±1.2
const MARKER_WORLD_TARGETS = [
  // Section 2 — Aerodynamics
  { name: 'wing_top',      w: [  0.0,  0.95, -1.0 ] },
  { name: 'gurney_flap',   w: [  0.3,  0.55, -1.1 ] },
  { name: 'diffuser',      w: [  0.0,  0.05, -1.0 ] },

  // Section 3 — Engine
  { name: 'throttle_body', w: [ -0.25, 0.70, -0.6 ] },
  { name: 'engine_block',  w: [  0.0,  0.55, -0.5 ] },
  { name: 'dry_sump',      w: [  0.2,  0.25, -0.55] },

  // Section 4 — Front-right wheel
  { name: 'brake_rotor',   w: [  0.85, 0.22,  0.75] },
  { name: 'wheel_rim',     w: [  0.95, 0.22,  0.72] },
  { name: 'tire',          w: [  0.88, 0.10,  0.78] },

  // Section 5 — Cockpit (top-down)
  { name: 'steering',      w: [  0.2,  1.05,  0.15] },
  { name: 'seat',          w: [  0.3,  0.90,  0.25] },
  { name: 'shifter',       w: [ -0.1,  0.85,  0.30] },
]

// Exported — starts empty, populated after model loads.
// Annotations.setMarkers() receives this reference; mutations are seen automatically.
export const markers = {}

const markerMaterial = new THREE.MeshBasicMaterial({ visible: false })
const markerGeo      = new THREE.SphereGeometry(0.01)

export function loadModel() {
  const manager = new THREE.LoadingManager()

  manager.onProgress = (url, loaded, total) => {
    const pct = Math.round((loaded / total) * 100)
    updateLoadingBar(pct)
  }

  manager.onLoad = () => { onLoadComplete() }

  manager.onError = (url) => {
    console.error('Failed to load:', url)
    updateLoadingBar(100)
    onLoadComplete()
  }

  const loader = new GLTFLoader(manager)
  loader.load(
    MODEL_URL,
    (gltf) => {
      const m = gltf.scene

      m.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      // Center and scale
      const box    = new THREE.Box3().setFromObject(m)
      const center = box.getCenter(new THREE.Vector3())
      const size   = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale  = 2.5 / maxDim

      m.scale.setScalar(scale)
      m.position.sub(center.multiplyScalar(scale))
      m.position.y = 0

      scene.add(m)
      setModel(m)

      // Convert desired world positions → local positions within m,
      // then attach invisible marker children.
      //
      // World = m.position + scale * local
      //   → local.x = (world.x - m.position.x) / scale
      //   → local.y =  world.y / scale          (m.position.y == 0)
      //   → local.z = (world.z - m.position.z) / scale
      MARKER_WORLD_TARGETS.forEach(({ name, w }) => {
        const mesh = new THREE.Mesh(markerGeo, markerMaterial)
        mesh.position.set(
          (w[0] - m.position.x) / scale,
           w[1] / scale,
          (w[2] - m.position.z) / scale
        )
        m.add(mesh)
        markers[name] = mesh
      })

      console.log('[ModelLoader] markers attached:', Object.keys(markers))
    },
    (xhr) => {
      if (xhr.total) updateLoadingBar(Math.round((xhr.loaded / xhr.total) * 100))
    },
    (error) => {
      console.error('GLTFLoader error:', error)
      updateLoadingBar(100)
      onLoadComplete()
    }
  )
}
