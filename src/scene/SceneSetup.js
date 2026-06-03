import * as THREE from 'three'
import { Particles } from './Particles.js'

export let scene, camera, renderer
export let model = null
export let particles

export const targetCamPos  = new THREE.Vector3(0, 1.0, 6.5)
export const targetLookAt  = new THREE.Vector3(0, 0.4, 0)
export const lookAtCurrent = new THREE.Vector3(0, 0.4, 0)
export let targetRotY = 0

let annotationsRef = null  // set via setAnnotationsInstance after init

const clock = new THREE.Clock()

export function setModel(m) { model = m }
export function setTargetCamera(x, y, z) { targetCamPos.set(x, y, z) }
export function setTargetLookAt(x, y, z) { targetLookAt.set(x, y, z) }
export function setTargetRotY(v) { targetRotY = v }
export function setAnnotationsInstance(a) { annotationsRef = a }

export function initScene() {
  const canvas = document.getElementById('webgl')
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  renderer.outputColorSpace = THREE.SRGBColorSpace

  scene = new THREE.Scene()
  scene.background = new THREE.Color('#050505')
  scene.fog = new THREE.FogExp2('#050505', 0.03)

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.set(0, 1.0, 6.5)
  camera.lookAt(0, 0.4, 0)

  const ambient = new THREE.AmbientLight('#ffffff', 0.25)
  scene.add(ambient)

  const dirLight = new THREE.DirectionalLight('#FFD580', 2.5)
  dirLight.position.set(5, 8, 5)
  dirLight.castShadow = true
  dirLight.shadow.mapSize.width  = 2048
  dirLight.shadow.mapSize.height = 2048
  dirLight.shadow.camera.far = 30
  scene.add(dirLight)

  const spotLight = new THREE.SpotLight('#4FC3F7', 80)
  spotLight.position.set(-6, 4, -4)
  spotLight.angle = 0.35
  spotLight.penumbra = 0.4
  scene.add(spotLight)

  const rectLight = new THREE.RectAreaLight('#FF2200', 10, 6, 2)
  rectLight.position.set(0, 1, -4)
  rectLight.lookAt(0, 0, 0)
  scene.add(rectLight)

  const pointLight = new THREE.PointLight('#C9A84C', 30, 15)
  pointLight.position.set(0, 6, 2)
  scene.add(pointLight)

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
      color: '#0a0a0a',
      metalness: 0.95,
      roughness: 0.1,
      transparent: true,
      opacity: 0.6
    })
  )
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  particles = new Particles(scene)

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

  animate()
}

function animate() {
  requestAnimationFrame(animate)

  const delta = clock.getDelta()

  camera.position.lerp(targetCamPos, 0.04)
  lookAtCurrent.lerp(targetLookAt, 0.04)
  camera.lookAt(lookAtCurrent)

  if (model) {
    model.rotation.y += (targetRotY - model.rotation.y) * 0.035
  }

  // Keep annotations in sync with actual model rotation
  if (annotationsRef) {
    annotationsRef.updateModelRotation(model ? model.rotation.y : 0)
  }

  // Debug: log projected screen positions when window._debugAnn is true
  if (window._debugAnn && annotationsRef && annotationsRef.active.length) {
    annotationsRef.active.forEach(ann => {
      const s = annotationsRef.toScreen(ann.tip3D)
      console.log(ann.label, '→ screen:', Math.round(s.x), Math.round(s.y), s.behind ? '[BEHIND]' : '')
    })
  }

  if (particles) particles.update(delta)

  renderer.render(scene, camera)
}
