import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { scene, setModel } from './SceneSetup.js'
import { onLoadComplete, updateLoadingBar } from '../ui/LoadingScreen.js'

const MODEL_URL = 'https://raw.githubusercontent.com/hoangtra02092006-ui/3D-Porches-File/main/Meshy_AI_A_sleek_Porsche_911_G_0603064402_texture.glb'

export function loadModel() {
  const manager = new THREE.LoadingManager()

  manager.onProgress = (url, loaded, total) => {
    const pct = Math.round((loaded / total) * 100)
    updateLoadingBar(pct)
  }

  manager.onLoad = () => {
    onLoadComplete()
  }

  manager.onError = (url) => {
    console.error('Failed to load:', url)
    // Still complete loading screen so site is usable
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
    },
    (xhr) => {
      if (xhr.total) {
        const pct = Math.round((xhr.loaded / xhr.total) * 100)
        updateLoadingBar(pct)
      }
    },
    (error) => {
      console.error('GLTFLoader error:', error)
      updateLoadingBar(100)
      onLoadComplete()
    }
  )
}
