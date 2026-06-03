import { SECTIONS } from '../scroll/sections.js'

let dots = []

export function initNavigation() {
  const container = document.getElementById('nav-dots')

  SECTIONS.forEach((section, i) => {
    const dot = document.createElement('div')
    dot.className = 'nav-dot' + (i === 0 ? ' active' : '')
    dot.title = section.name
    dot.addEventListener('click', () => {
      const el = document.getElementById(section.id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    })
    container.appendChild(dot)
    dots.push(dot)
  })

  // Scrolled class on nav
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('top-nav')
    if (window.scrollY > 50) {
      nav.classList.add('scrolled')
    } else {
      nav.classList.remove('scrolled')
    }
  })
}

export function setActiveDot(index) {
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === index)
  })
}
