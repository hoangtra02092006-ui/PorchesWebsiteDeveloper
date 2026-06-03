import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SECTIONS } from './sections.js'
import { setTargetCamera, setTargetLookAt, setTargetRotY } from '../scene/SceneSetup.js'
import { showAnnotations } from '../ui/Annotations.js'
import { setActiveDot } from '../ui/Navigation.js'

gsap.registerPlugin(ScrollTrigger)

export function initScrollController() {
  SECTIONS.forEach((section, index) => {
    ScrollTrigger.create({
      trigger: `#${section.id}`,
      start: 'top center',
      end:   'bottom center',
      scrub: false,
      onEnter:     () => transitionToSection(section, index),
      onEnterBack: () => transitionToSection(section, index)
    })
  })

  // Scroll progress bar
  ScrollTrigger.create({
    trigger: 'body',
    start:   'top top',
    end:     'bottom bottom',
    onUpdate: (self) => {
      const bar = document.getElementById('scroll-progress-bar')
      if (bar) bar.style.height = (self.progress * 100) + 'vh'
    }
  })
}

function transitionToSection(section, index) {
  // Move camera
  setTargetCamera(section.camera.x, section.camera.y, section.camera.z)
  setTargetLookAt(section.lookAt.x, section.lookAt.y, section.lookAt.z)
  setTargetRotY(section.rotY)

  // Animate text panel
  const isLeft   = !!document.querySelector(`#${section.id} .left-panel`)
  const xOffset  = isLeft ? -60 : 60

  gsap.fromTo(
    `#${section.id} .panel`,
    { opacity: 0, x: xOffset },
    { opacity: 1, x: 0, duration: 1.0, ease: 'power3.out' }
  )

  // Annotations
  showAnnotations(section.annotations)

  // Nav dot
  setActiveDot(index)
}
