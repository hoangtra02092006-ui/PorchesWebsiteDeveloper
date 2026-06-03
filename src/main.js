import './style.css'
import * as THREE from 'three'
import { initScene, camera, renderer, setAnnotationsInstance } from './scene/SceneSetup.js'
import { loadModel, markers } from './scene/ModelLoader.js'
import { initLoadingScreen } from './ui/LoadingScreen.js'
import { initNavigation } from './ui/Navigation.js'
import { initScrollController } from './scroll/ScrollController.js'
import { Annotations } from './ui/Annotations.js'

// Three.js scene must be first — creates camera + renderer
initScene()

// Create annotations, pass live camera + renderer refs, and the markers reference.
// markers starts as {} and is populated in-place when the model loads.
// The reference stays valid — no need to call setMarkers again later.
const annotations = new Annotations(camera, renderer)
annotations.setMarkers(markers)

// Register with render loop (liveUpdate called every frame)
setAnnotationsInstance(annotations)

initNavigation()

initLoadingScreen(() => {
  initScrollController(annotations)
})

loadModel()

// ── CALIBRATION HELPER ──
// Press D in browser console to log each marker's current screen position.
// Adjust MARKER_WORLD_TARGETS in ModelLoader.js until dots land on the right parts.
window.addEventListener('keydown', e => {
  if (e.key !== 'd' && e.key !== 'D') return
  if (!Object.keys(markers).length) {
    console.log('[Debug] Model not loaded yet')
    return
  }
  console.log('[Debug] Marker screen positions:')
  const W = window.innerWidth
  const H = window.innerHeight
  Object.entries(markers).forEach(([name, mesh]) => {
    const worldPos = new THREE.Vector3()
    mesh.getWorldPosition(worldPos)
    const p = worldPos.clone().project(camera)
    const x = ((p.x * 0.5 + 0.5) * W).toFixed(0)
    const y = ((-p.y * 0.5 + 0.5) * H).toFixed(0)
    const pct = `${((p.x * 0.5 + 0.5) * 100).toFixed(1)}% x ${((-p.y * 0.5 + 0.5) * 100).toFixed(1)}%`
    console.log(`  ${name.padEnd(14)} screen(${x}, ${y})  viewport(${pct})  ${p.z > 1 ? 'BEHIND' : 'visible'}`)
  })
})
