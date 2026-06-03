import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SECTIONS } from './sections.js'
import { setTargetCamera, setTargetLookAt, setTargetRotY } from '../scene/SceneSetup.js'
import { setActiveDot } from '../ui/Navigation.js'

gsap.registerPlugin(ScrollTrigger)

let _annotations      = null
let currentSectionIndex = -1

export function initScrollController(annotations) {
  _annotations = annotations

  // Start clean
  _annotations.hide()
  currentSectionIndex = 0

  SECTIONS.forEach((section, i) => {
    ScrollTrigger.create({
      trigger: `#${section.id}`,
      start: 'top 40%',
      end:   'bottom 40%',
      onEnter:     () => activateSection(i),
      onEnterBack: () => activateSection(i),
      onLeave:     () => deactivateSection(i),
      onLeaveBack: () => deactivateSection(i),
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

function activateSection(i) {
  if (currentSectionIndex === i) return   // already active, skip
  currentSectionIndex = i
  const section = SECTIONS[i]

  // Camera + model
  setTargetCamera(section.camera.x, section.camera.y, section.camera.z)
  setTargetLookAt(section.lookAt.x, section.lookAt.y, section.lookAt.z)
  setTargetRotY(section.rotY)

  // Panel animation
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

  // Nav dot
  setActiveDot(i)

  // Annotations — always hide first, then show if section has any
  _annotations.hide()
  if (section.annotations && section.annotations.length > 0) {
    setTimeout(() => {
      // Guard: only show if user hasn't scrolled away in the meantime
      if (currentSectionIndex === i) {
        _annotations.show(section.annotations)
      }
    }, 420)
  }
}

function deactivateSection(i) {
  // Only act if this section was the active one
  if (currentSectionIndex === i) {
    currentSectionIndex = -1
    _annotations.hide()
  }
}
