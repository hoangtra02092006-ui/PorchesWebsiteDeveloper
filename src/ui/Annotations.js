import * as THREE from 'three'

export class Annotations {
  constructor(camera, renderer) {
    this.camera   = camera
    this.renderer = renderer
    this.svg      = document.getElementById('annotation-svg')
    this.active   = []
    this.modelRotY = 0
    window.addEventListener('resize', () => this.redraw())
  }

  updateModelRotation(rotY) {
    this.modelRotY = rotY
  }

  toScreen(worldPos) {
    const angle = this.modelRotY
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const rx = worldPos.x * cos - worldPos.z * sin
    const rz = worldPos.x * sin + worldPos.z * cos

    const vec = new THREE.Vector3(rx, worldPos.y, rz)
    vec.project(this.camera)

    const W = this.renderer.domElement.clientWidth
    const H = this.renderer.domElement.clientHeight
    return {
      x: (vec.x * 0.5 + 0.5) * W,
      y: (-vec.y * 0.5 + 0.5) * H,
      behind: vec.z > 1
    }
  }

  show(annotationsArray) {
    console.log('[Annotations] showing', annotationsArray.length, 'annotations')
    this.active = annotationsArray
    this.redraw()
  }

  hide() {
    this.active = []
    const groups = this.svg.querySelectorAll('.ann-group')
    groups.forEach(g => {
      g.style.transition = 'opacity 0.3s'
      g.style.opacity = '0'
    })
    setTimeout(() => { this.svg.innerHTML = '' }, 320)
  }

  redraw() {
    this.svg.innerHTML = ''
    if (!this.active.length) return
    this.active.forEach((ann, i) => {
      setTimeout(() => this._draw(ann, i), i * 200)
    })
  }

  _draw(ann, index) {
    const W = window.innerWidth
    const H = window.innerHeight

    const screen = this.toScreen(ann.tip3D)
    if (screen.behind) return

    const x1 = screen.x
    const y1 = screen.y
    const x2 = (ann.endX / 100) * W
    const y2 = (ann.endY / 100) * H

    // L-shape elbow: horizontal from tip, then vertical to label end
    const elbowX = x2
    const elbowY = y1

    const seg1     = Math.hypot(elbowX - x1, elbowY - y1)
    const seg2     = Math.abs(y2 - elbowY)
    const totalLen = Math.max(seg1 + seg2, 1)

    const NS = 'http://www.w3.org/2000/svg'

    const g = document.createElementNS(NS, 'g')
    g.setAttribute('class', 'ann-group')
    g.style.opacity = '0'

    // Outer pulse ring
    const ring = document.createElementNS(NS, 'circle')
    ring.setAttribute('cx', x1)
    ring.setAttribute('cy', y1)
    ring.setAttribute('r', '4')
    ring.setAttribute('fill', 'none')
    ring.setAttribute('stroke', '#C9A84C')
    ring.setAttribute('stroke-width', '1.5')
    ring.innerHTML = `
      <animate attributeName="r" values="4;16;4" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite"/>
    `

    // Solid center dot
    const dot = document.createElementNS(NS, 'circle')
    dot.setAttribute('cx', x1)
    dot.setAttribute('cy', y1)
    dot.setAttribute('r', '4')
    dot.setAttribute('fill', '#C9A84C')

    // Animated line: tip → elbow → label end
    const line = document.createElementNS(NS, 'polyline')
    line.setAttribute('points', `${x1},${y1} ${elbowX},${elbowY} ${x2},${y2}`)
    line.setAttribute('fill', 'none')
    line.setAttribute('stroke', '#C9A84C')
    line.setAttribute('stroke-width', '1')
    line.setAttribute('opacity', '0.75')
    line.setAttribute('stroke-dasharray', `${totalLen}`)
    line.setAttribute('stroke-dashoffset', `${totalLen}`)
    line.innerHTML = `
      <animate attributeName="stroke-dashoffset"
        from="${totalLen}" to="0" dur="0.6s"
        fill="freeze" calcMode="spline"
        keyTimes="0;1" keySplines="0.25 0.1 0.25 1"/>
    `

    // Short tick at label end
    const tick = document.createElementNS(NS, 'line')
    tick.setAttribute('x1', x2)
    tick.setAttribute('y1', y2 - 5)
    tick.setAttribute('x2', x2)
    tick.setAttribute('y2', y2 + 5)
    tick.setAttribute('stroke', '#C9A84C')
    tick.setAttribute('stroke-width', '1')
    tick.setAttribute('opacity', '0.6')

    // Label foreignObject
    const labelW = 220
    const labelX = ann.side === 'right' ? x2 + 12 : x2 - labelW - 12
    const labelY = y2 - 22

    const fo = document.createElementNS(NS, 'foreignObject')
    fo.setAttribute('x',       String(labelX))
    fo.setAttribute('y',       String(labelY))
    fo.setAttribute('width',   String(labelW))
    fo.setAttribute('height',  '52')
    fo.setAttribute('overflow','visible')
    fo.innerHTML = `<div xmlns="http://www.w3.org/1999/xhtml"
      style="font-family:'Rajdhani',sans-serif;">
      <div style="font-size:0.8rem;font-weight:600;color:#fff;
                  letter-spacing:0.04em;line-height:1.3;white-space:nowrap;">
        ${ann.label}
      </div>
      <div style="font-size:0.63rem;font-weight:300;margin-top:3px;
                  color:rgba(255,255,255,0.45);white-space:nowrap;">
        ${ann.sublabel}
      </div>
    </div>`

    g.appendChild(ring)
    g.appendChild(line)
    g.appendChild(tick)
    g.appendChild(fo)
    g.appendChild(dot)  // dot on top so it's always visible
    this.svg.appendChild(g)

    requestAnimationFrame(() => {
      setTimeout(() => {
        g.style.transition = 'opacity 0.35s ease'
        g.style.opacity = '1'
      }, 80)
    })
  }
}
