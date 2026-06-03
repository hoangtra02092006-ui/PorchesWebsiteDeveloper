import './style.css'
import { initScene } from './scene/SceneSetup.js'
import { loadModel } from './scene/ModelLoader.js'
import { initLoadingScreen } from './ui/LoadingScreen.js'
import { initNavigation } from './ui/Navigation.js'
import { initScrollController } from './scroll/ScrollController.js'

// Init Three.js scene first
initScene()

// Init UI
initNavigation()

// Init loading screen, pass callback for when model is loaded
initLoadingScreen(() => {
  // After load: init scroll-driven interactions
  initScrollController()
})

// Start loading the model (drives loading screen progress)
loadModel()
