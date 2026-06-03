import './style.css'
import * as THREE from 'three'
import { initScene, camera, renderer, setAnnotationsInstance } from './scene/SceneSetup.js'
import { loadModel, markers } from './scene/ModelLoader.js'
import { initLoadingScreen } from './ui/LoadingScreen.js'
import { initNavigation } from './ui/Navigation.js'
import { initScrollController } from './scroll/ScrollController.js'
import { Annotations } from './ui/Annotations.js'

initScene()

const annotations = new Annotations(camera, renderer)
annotations.setMarkers(markers)  // reference — populated in-place when model loads
setAnnotationsInstance(annotations)

initNavigation()

initLoadingScreen(() => {
  initScrollController(annotations)

  // Print calibration reference once markers are ready
  const names = Object.keys(markers)
  console.log(
    `%c[MARKER CALIBRATION MODE]\n` +
    `Press number keys to select a marker:\n` +
    names.map((n, i) => `  ${i + 1}: ${n}`).join('\n') + '\n\n' +
    `Arrow keys  → move X / Z\n` +
    `W / S       → move Y (up / down)\n` +
    `Shift + key → larger step (0.05 instead of 0.02)\n` +
    `P           → print all positions to copy into MARKER_DEFS\n` +
    `0           → deselect current marker`,
    'color:#C9A84C; font-weight:bold'
  )
})

loadModel()

// ── KEYBOARD CALIBRATION ──
let selectedMarker     = null
let selectedMarkerName = null

window.addEventListener('keydown', e => {
  // 1–9: select marker by index
  const idx = parseInt(e.key) - 1
  if (!isNaN(idx) && idx >= 0) {
    const names = Object.keys(markers)
    if (!names.length) { console.log('[Cal] Model not loaded yet'); return }
    if (idx < names.length) {
      // Deselect previous
      if (selectedMarker) selectedMarker.scale.setScalar(1)
      selectedMarkerName = names[idx]
      selectedMarker     = markers[selectedMarkerName]
      selectedMarker.scale.setScalar(3)   // make it bigger for visibility
      const p = selectedMarker.position
      console.log(`[Cal] Selected: ${selectedMarkerName}  local(${p.x.toFixed(3)}, ${p.y.toFixed(3)}, ${p.z.toFixed(3)})`)
    }
    return
  }

  if (!selectedMarker) return

  const step = e.shiftKey ? 0.05 : 0.02

  if (e.key === 'ArrowRight') { selectedMarker.position.x += step; e.preventDefault() }
  if (e.key === 'ArrowLeft')  { selectedMarker.position.x -= step; e.preventDefault() }
  if (e.key === 'ArrowUp')    { selectedMarker.position.z -= step; e.preventDefault() }
  if (e.key === 'ArrowDown')  { selectedMarker.position.z += step; e.preventDefault() }
  if (e.key === 'w' || e.key === 'W') { selectedMarker.position.y += step }
  if (e.key === 's' || e.key === 'S') { selectedMarker.position.y -= step }

  // P — print all current positions
  if (e.key === 'p' || e.key === 'P') {
    const wp = new THREE.Vector3()
    console.log('%c[Cal] Current marker LOCAL positions (paste into MARKER_DEFS):', 'color:#C9A84C')
    Object.entries(markers).forEach(([name, mesh]) => {
      const lp = mesh.position
      console.log(`  { name: '${name.padEnd(14)}', pos: [${lp.x.toFixed(4)}, ${lp.y.toFixed(4)}, ${lp.z.toFixed(4)}] },`)
    })
    console.log('%c[Cal] Current marker WORLD positions:', 'color:#4FC3F7')
    Object.entries(markers).forEach(([name, mesh]) => {
      mesh.getWorldPosition(wp)
      const proj = wp.clone().project(camera)
      const sx = ((proj.x * 0.5 + 0.5) * window.innerWidth).toFixed(0)
      const sy = ((-proj.y * 0.5 + 0.5) * window.innerHeight).toFixed(0)
      console.log(`  ${name.padEnd(14)} world(${wp.x.toFixed(3)}, ${wp.y.toFixed(3)}, ${wp.z.toFixed(3)})  screen(${sx}, ${sy})`)
    })
  }

  // 0 — deselect
  if (e.key === '0') {
    if (selectedMarker) selectedMarker.scale.setScalar(1)
    selectedMarker     = null
    selectedMarkerName = null
    console.log('[Cal] Deselected')
  }
})
