import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SECTIONS } from './sections.js'
import { setTargetCamera, setTargetLookAt, setTargetRotY } from '../scene/SceneSetup.js'
import { setActiveDot } from '../ui/Navigation.js'

gsap.registerPlugin(ScrollTrigger)

let _annotations = null

export function initScrollController(annotations) {
  _annotations = annotations

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
  setTargetCamera(section.camera.x, section.camera.y, section.camera.z)
  setTargetLookAt(section.lookAt.x, section.lookAt.y, section.lookAt.z)
  setTargetRotY(section.rotY)

  const panel = document.querySelector(`#${section.id} .panel`)
  if (panel) {
    const isLeft  = panel.classList.contains('left-panel')
    const isRight = panel.classList.contains('right-panel')
    const xOffset = isLeft ? -60 : isRight ? 60 : 0
    gsap.fromTo(panel,
      { opacity: 0, x: xOffset },
      { opacity: 1, x: 0, duration: 1.0, ease: 'power3.out' }
    )
  }

  // Hide current annotations, then show new ones after camera starts moving
  if (_annotations) {
    _annotations.hide()
    setTimeout(() => _annotations.show(section.annotations), 350)
  }

  setActiveDot(index)
}
