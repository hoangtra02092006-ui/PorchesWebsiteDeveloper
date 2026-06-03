export class Annotations {
  constructor() {
    this.svg = document.getElementById('annotation-svg')
    this.currentAnnotations = []
    window.addEventListener('resize', () => this.redraw())
  }

  show(annotationsArray) {
    console.log('[Annotations] showing', annotationsArray.length, 'annotations')
    this.currentAnnotations = annotationsArray
    this.redraw()
  }

  hide() {
    this.currentAnnotations = []
    const els = this.svg.querySelectorAll('.ann-group')
    els.forEach(el => {
      el.style.transition = 'opacity 0.3s'
      el.style.opacity = '0'
    })
    setTimeout(() => { this.svg.innerHTML = '' }, 350)
  }

  redraw() {
    this.svg.innerHTML = ''
    if (!this.currentAnnotations.length) return
    this.currentAnnotations.forEach((ann, i) => {
      setTimeout(() => this.drawOne(ann, i), i * 220)
    })
  }

  drawOne(ann, index) {
    const W = window.innerWidth
    const H = window.innerHeight

    const x1 = (ann.tipX / 100) * W
    const y1 = (ann.tipY / 100) * H
    const x2 = (ann.endX / 100) * W
    const y2 = (ann.endY / 100) * H

    // L-shape: tip → (x2, y1) → (x2, y2)
    const ex = x2
    const ey = y1

    const seg1     = Math.hypot(ex - x1, ey - y1)
    const seg2     = Math.abs(y2 - ey)
    const totalLen = (seg1 + seg2).toFixed(1)

    const NS = 'http://www.w3.org/2000/svg'

    const g = document.createElementNS(NS, 'g')
    g.setAttribute('class', 'ann-group')
    g.style.opacity = '0'

    // ── PULSING RING ──
    const ring = document.createElementNS(NS, 'circle')
    ring.setAttribute('cx', x1)
    ring.setAttribute('cy', y1)
    ring.setAttribute('r', '3')
    ring.setAttribute('fill', 'none')
    ring.setAttribute('stroke', '#C9A84C')
    ring.setAttribute('stroke-width', '1')
    ring.innerHTML = `
      <animate attributeName="r" from="3" to="14"
        dur="1.6s" repeatCount="indefinite" begin="0s"/>
      <animate attributeName="opacity" from="0.7" to="0"
        dur="1.6s" repeatCount="indefinite" begin="0s"/>
    `

    // ── SOLID DOT ──
    const dot = document.createElementNS(NS, 'circle')
    dot.setAttribute('cx', x1)
    dot.setAttribute('cy', y1)
    dot.setAttribute('r', '3.5')
    dot.setAttribute('fill', '#C9A84C')

    // ── ELBOW LINE with draw animation ──
    const path = document.createElementNS(NS, 'polyline')
    path.setAttribute('points', `${x1},${y1} ${ex},${ey} ${x2},${y2}`)
    path.setAttribute('fill', 'none')
    path.setAttribute('stroke', '#C9A84C')
    path.setAttribute('stroke-width', '0.9')
    path.setAttribute('opacity', '0.8')
    path.setAttribute('stroke-dasharray', totalLen)
    path.setAttribute('stroke-dashoffset', totalLen)
    path.innerHTML = `
      <animate attributeName="stroke-dashoffset"
        from="${totalLen}" to="0"
        dur="0.55s" fill="freeze" begin="0s"
        calcMode="spline" keyTimes="0;1"
        keySplines="0.4 0 0.2 1"/>
    `

    // ── END TICK ──
    const tick = document.createElementNS(NS, 'line')
    tick.setAttribute('x1', x2 - 6)
    tick.setAttribute('y1', y2)
    tick.setAttribute('x2', x2 + 6)
    tick.setAttribute('y2', y2)
    tick.setAttribute('stroke', '#C9A84C')
    tick.setAttribute('stroke-width', '1')
    tick.setAttribute('opacity', '0.7')

    // ── LABEL (foreignObject) ──
    const labelW = 210
    const labelH = 52
    const labelX = ann.side === 'right' ? x2 + 14 : x2 - labelW - 14
    const labelY = y2 - 24

    const fo = document.createElementNS(NS, 'foreignObject')
    fo.setAttribute('x', labelX)
    fo.setAttribute('y', labelY)
    fo.setAttribute('width', labelW)
    fo.setAttribute('height', labelH)
    fo.setAttribute('overflow', 'visible')
    fo.innerHTML = `
      <div xmlns="http://www.w3.org/1999/xhtml"
           style="font-family:'Rajdhani',sans-serif; line-height:1.3;">
        <div style="font-size:0.78rem; font-weight:600; color:#ffffff;
                    letter-spacing:0.05em; white-space:nowrap;">
          ${ann.label}
        </div>
        <div style="font-size:0.62rem; font-weight:300;
                    color:rgba(255,255,255,0.45); margin-top:3px;
                    white-space:nowrap;">
          ${ann.sublabel}
        </div>
      </div>
    `

    g.appendChild(ring)
    g.appendChild(dot)
    g.appendChild(path)
    g.appendChild(tick)
    g.appendChild(fo)
    this.svg.appendChild(g)

    // Fade in group
    setTimeout(() => {
      g.style.transition = 'opacity 0.4s ease'
      g.style.opacity = '1'
    }, 60)
  }
}
