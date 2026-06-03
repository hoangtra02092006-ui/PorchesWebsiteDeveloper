import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { scene, setModel } from './SceneSetup.js'
import { onLoadComplete, updateLoadingBar } from '../ui/LoadingScreen.js'

const MODEL_URL = 'https://raw.githubusercontent.com/hoangtra02092006-ui/3D-Porches-File/main/Meshy_AI_A_sleek_Porsche_911_G_0603064402_texture.glb'

// ── Set to false when calibration is complete ──
const DEBUG_MARKERS = true

// Exported — starts empty, populated in-place after model loads
export const markers = {}

const markerMaterial = new THREE.MeshBasicMaterial({
  color: 0xFF0000,
  visible: DEBUG_MARKERS,
  depthTest: false       // always renders on top of the car
})
const markerGeo = new THREE.SphereGeometry(DEBUG_MARKERS ? 0.04 : 0.01)

export function loadModel() {
  const manager = new THREE.LoadingManager()

  manager.onProgress = (url, loaded, total) => {
    const pct = Math.round((loaded / total) * 100)
    updateLoadingBar(pct)
  }
  manager.onLoad  = () => { onLoadComplete() }
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

      // ── Center and scale ──
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

      // Force matrix update so worldToLocal() is accurate
      m.updateMatrixWorld(true)

      // ── Measure WORLD-SPACE bounds after transform ──
      const worldBox  = new THREE.Box3().setFromObject(m)
      const wSize     = worldBox.getSize(new THREE.Vector3())
      const BW = wSize.x, BH = wSize.y, BL = wSize.z

      console.log('%c[ModelLoader] Model world bounds after transform', 'color:#C9A84C;font-weight:bold')
      console.log('  size:  ', { x: BW.toFixed(3), y: BH.toFixed(3), z: BL.toFixed(3) })
      console.log('  min:   ', { x: worldBox.min.x.toFixed(3), y: worldBox.min.y.toFixed(3), z: worldBox.min.z.toFixed(3) })
      console.log('  max:   ', { x: worldBox.max.x.toFixed(3), y: worldBox.max.y.toFixed(3), z: worldBox.max.z.toFixed(3) })
      console.log('  Car nose  (front): z =', worldBox.max.z.toFixed(3))
      console.log('  Car tail  (rear):  z =', worldBox.min.z.toFixed(3))
      console.log('  Car roof  (top):   y =', worldBox.max.y.toFixed(3))
      console.log('  Car floor (bottom):y =', worldBox.min.y.toFixed(3))
      console.log('  Car left:          x =', worldBox.min.x.toFixed(3))
      console.log('  Car right:         x =', worldBox.max.x.toFixed(3))

      // ── Helper: world position via normalised ratios ──
      // rx: 0 = left edge, 1 = right edge
      // ry: 0 = floor,     1 = roof
      // rz: 0 = front nose, 1 = rear tail  (maxZ → minZ)
      const p = (rx, ry, rz) => new THREE.Vector3(
        worldBox.min.x + rx * BW,
        worldBox.min.y + ry * BH,
        worldBox.max.z - rz * BL
      )

      // ── MARKER DEFS in world space ──
      // Adjust rx/ry/rz ratios until red dots sit on the correct car parts.
      // Press 1-9 in browser to select a marker, then arrow keys + W/S to nudge.
      // Press P to print updated positions.
      const MARKER_DEFS = [
        // ── Section 2: Aerodynamics ──
        { name: 'wing_top',      pos: p(0.50, 0.90, 0.85) },  // rear wing top
        { name: 'gurney_flap',   pos: p(0.60, 0.45, 0.92) },  // rear bumper
        { name: 'diffuser',      pos: p(0.50, 0.05, 0.90) },  // underbody rear

        // ── Section 3: Engine (rear-engine — engine at BACK) ──
        { name: 'throttle_body', pos: p(0.35, 0.72, 0.78) },  // engine cover top
        { name: 'engine_block',  pos: p(0.50, 0.50, 0.80) },  // center engine bay
        { name: 'dry_sump',      pos: p(0.55, 0.22, 0.75) },  // lower engine

        // ── Section 4: Brakes & Wheels (rear-right wheel) ──
        { name: 'brake_rotor',   pos: p(0.85, 0.18, 0.78) },  // wheel hub center
        { name: 'wheel_rim',     pos: p(0.90, 0.22, 0.78) },  // rim outer edge
        { name: 'tire',          pos: p(0.88, 0.08, 0.80) },  // tire bottom contact

        // ── Section 5: Cockpit (top-down view) ──
        { name: 'steering',      pos: p(0.60, 0.88, 0.40) },  // driver side roof
        { name: 'seat',          pos: p(0.65, 0.78, 0.50) },  // driver seat area
        { name: 'shifter',       pos: p(0.50, 0.72, 0.48) },  // center console
      ]

      // ── Create marker meshes as children of the model ──
      MARKER_DEFS.forEach(({ name, pos }) => {
        const mesh = new THREE.Mesh(markerGeo, markerMaterial.clone())
        // Convert desired world pos → model's local space
        const localPos = pos.clone()
        m.worldToLocal(localPos)
        mesh.position.copy(localPos)
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
