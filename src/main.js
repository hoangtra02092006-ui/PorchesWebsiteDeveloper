import './style.css'
import { initScene, camera, renderer, setAnnotationsInstance } from './scene/SceneSetup.js'
import { loadModel } from './scene/ModelLoader.js'
import { initLoadingScreen } from './ui/LoadingScreen.js'
import { initNavigation } from './ui/Navigation.js'
import { initScrollController } from './scroll/ScrollController.js'
import { Annotations } from './ui/Annotations.js'

// Three.js scene must be first so camera + renderer are available
initScene()

// Create Annotations with live camera + renderer references
const annotations = new Annotations(camera, renderer)

// Register with render loop so it gets rotation updates every frame
setAnnotationsInstance(annotations)

// Static UI
initNavigation()

// After model loads: wire up scroll-driven transitions
initLoadingScreen(() => {
  initScrollController(annotations)
})

loadModel()
