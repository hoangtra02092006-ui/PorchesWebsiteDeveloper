import gsap from 'gsap'

const svg = document.getElementById('annotation-svg')
let currentAnnotations = []

export function showAnnotations(annotations) {
  // Clear
  while (svg.firstChild) svg.removeChild(svg.firstChild)
  currentAnnotations = annotations

  if (!annotations || annotations.length === 0) return

  annotations.forEach((ann, index) => {
    setTimeout(() => drawAnnotation(ann, index), index * 200)
  })
}

function drawAnnotation(ann, index) {
  const vw = window.innerWidth
  const vh = window.innerHeight

  const x1 = ann.tipX / 100 * vw
  const y1 = ann.tipY / 100 * vh
  const x2 = ann.endX / 100 * vw
  const y2 = ann.endY / 100 * vh

  const mx = x1 + (x2 - x1) * 0.45
  const my = y2

  const lineLen = Math.hypot(mx - x1, my - y1) + Math.abs(x2 - mx)
  const lenStr  = lineLen.toFixed(1)

  const ns = 'http://www.w3.org/2000/svg'

  // A) Pulsing dot — solid core
  const dot = document.createElementNS(ns, 'circle')
  dot.setAttribute('cx', x1)
  dot.setAttribute('cy', y1)
  dot.setAttribute('r',  3)
  dot.setAttribute('fill', '#C9A84C')
  svg.appendChild(dot)

  // A) Pulse ring
  const ring = document.createElementNS(ns, 'circle')
  ring.setAttribute('cx', x1)
  ring.setAttribute('cy', y1)
  ring.setAttribute('r',  3)
  ring.setAttribute('fill', 'none')
  ring.setAttribute('stroke', '#C9A84C')
  ring.setAttribute('stroke-width', '1')

  const animR = document.createElementNS(ns, 'animate')
  animR.setAttribute('attributeName', 'r')
  animR.setAttribute('from', '3')
  animR.setAttribute('to',   '12')
  animR.setAttribute('dur',  '1.5s')
  animR.setAttribute('repeatCount', 'indefinite')
  ring.appendChild(animR)

  const animO = document.createElementNS(ns, 'animate')
  animO.setAttribute('attributeName', 'opacity')
  animO.setAttribute('from', '0.6')
  animO.setAttribute('to',   '0')
  animO.setAttribute('dur',  '1.5s')
  animO.setAttribute('repeatCount', 'indefinite')
  ring.appendChild(animO)
  svg.appendChild(ring)

  // B) Elbow polyline with draw animation
  const poly = document.createElementNS(ns, 'polyline')
  poly.setAttribute('points', `${x1},${y1} ${mx},${my} ${x2},${y2}`)
  poly.setAttribute('fill', 'none')
  poly.setAttribute('stroke', '#C9A84C')
  poly.setAttribute('stroke-width', '0.8')
  poly.setAttribute('opacity', '0.75')
  poly.setAttribute('stroke-dasharray', lenStr)
  poly.setAttribute('stroke-dashoffset', lenStr)

  const animDash = document.createElementNS(ns, 'animate')
  animDash.setAttribute('attributeName', 'stroke-dashoffset')
  animDash.setAttribute('from', lenStr)
  animDash.setAttribute('to',   '0')
  animDash.setAttribute('dur',  '0.5s')
  animDash.setAttribute('begin', `${index * 0.2}s`)
  animDash.setAttribute('fill',  'forward')
  poly.appendChild(animDash)
  svg.appendChild(poly)

  // C) Tick at end
  const tick = document.createElementNS(ns, 'line')
  tick.setAttribute('x1', x2)
  tick.setAttribute('y1', y2 - 5)
  tick.setAttribute('x2', x2)
  tick.setAttribute('y2', y2 + 5)
  tick.setAttribute('stroke', '#C9A84C')
  tick.setAttribute('stroke-width', '0.8')
  tick.setAttribute('opacity', '0.6')
  svg.appendChild(tick)

  // D) Label foreignObject
  const labelWidth = 220
  let fx = ann.side === 'right' ? x2 + 12 : x2 - labelWidth - 12
  const fy = y2 - 18

  const fo = document.createElementNS(ns, 'foreignObject')
  fo.setAttribute('x',      fx)
  fo.setAttribute('y',      fy)
  fo.setAttribute('width',  labelWidth)
  fo.setAttribute('height', 60)
  fo.style.overflow = 'visible'

  const div = document.createElement('div')
  div.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
  div.style.cssText = 'font-family: Rajdhani, sans-serif;'

  const labelEl = document.createElement('div')
  labelEl.style.cssText = `
    font-size: 0.78rem;
    font-weight: 600;
    color: #fff;
    letter-spacing: 0.04em;
    line-height: 1.3;
  `
  labelEl.textContent = ann.label

  const sublabelEl = document.createElement('div')
  sublabelEl.style.cssText = `
    font-size: 0.65rem;
    font-weight: 300;
    color: rgba(255,255,255,0.45);
    margin-top: 3px;
  `
  sublabelEl.textContent = ann.sublabel

  div.appendChild(labelEl)
  div.appendChild(sublabelEl)
  fo.appendChild(div)
  svg.appendChild(fo)

  gsap.fromTo(fo,
    { opacity: 0 },
    { opacity: 1, duration: 0.4, delay: index * 0.2 + 0.45 }
  )
}

// Redraw on resize
window.addEventListener('resize', () => {
  if (currentAnnotations.length > 0) {
    showAnnotations(currentAnnotations)
  }
})
