import * as THREE from 'three'

const NS = 'http://www.w3.org/2000/svg'

export class Annotations {
  constructor(camera, renderer) {
    this.camera   = camera
    this.renderer = renderer
    this.svg      = document.getElementById('annotation-svg')
    this.markers  = {}  // set via setMarkers() — reference to ModelLoader.markers
    this.active   = []
    window.addEventListener('resize', () => this.redraw())
  }

  setMarkers(markersMap) {
    this.markers = markersMap
  }

  // Returns current screen {x, y} of a named marker, or null if behind camera / missing
  _getScreenPos(markerName) {
    const mesh = this.markers[markerName]
    if (!mesh) return null

    const worldPos = new THREE.Vector3()
    mesh.getWorldPosition(worldPos)   // Three.js applies all parent transforms

    const projected = worldPos.clone().project(this.camera)
    if (projected.z > 1) return null  // behind near plane

    const W = this.renderer.domElement.clientWidth
    const H = this.renderer.domElement.clientHeight
    return {
      x: ( projected.x * 0.5 + 0.5) * W,
      y: (-projected.y * 0.5 + 0.5) * H
    }
  }

  show(annotationsArray) {
    console.log('[Annotations] showing', annotationsArray.length, 'annotations')
    this.active = annotationsArray
    this.redraw()
  }

  hide() {
    this.active = []
    this.svg.querySelectorAll('.ann-group').forEach(g => {
      g.style.transition = 'opacity 0.25s'
      g.style.opacity = '0'
    })
    setTimeout(() => { this.svg.innerHTML = '' }, 300)
  }

  redraw() {
    this.svg.innerHTML = ''
    if (!this.active.length) return
    this.active.forEach((ann, i) => {
      setTimeout(() => this._drawOne(ann, i), i * 180)
    })
  }

  // Called every frame — only moves the tip dot; line/tick/label are fixed to endX/endY
  liveUpdate() {
    const groups = this.svg.querySelectorAll('.ann-group')
    if (!groups.length || groups.length !== this.active.length) return

    const W = window.innerWidth
    const H = window.innerHeight

    this.active.forEach((ann, i) => {
      const screen = this._getScreenPos(ann.tipMarker)
      if (!screen) return
      const g = groups[i]
      if (!g) return

      const x1 = screen.x
      const y1 = screen.y
      const x2 = (ann.endX / 100) * W
      const y2 = (ann.endY / 100) * H
      const ex = x2
      const ey = y1

      // Move both circles (pulse ring + solid dot) to new tip position
      g.querySelectorAll('circle').forEach(c => {
        c.setAttribute('cx', String(x1))
        c.setAttribute('cy', String(y1))
      })

      // Update polyline points only — never touch dasharray/dashoffset here
      const poly = g.querySelector('polyline')
      if (poly) poly.setAttribute('points', `${x1},${y1} ${ex},${ey} ${x2},${y2}`)

      // tick and foreignObject are anchored to endX/endY (fixed viewport %) — do not update
    })
  }

  _drawOne(ann, index) {
    const screen = this._getScreenPos(ann.tipMarker)
    if (!screen) {
      console.warn('[Annotations] marker not found or behind camera:', ann.tipMarker)
      return
    }

    const W  = window.innerWidth
    const H  = window.innerHeight
    const x1 = screen.x
    const y1 = screen.y
    const x2 = (ann.endX / 100) * W
    const y2 = (ann.endY / 100) * H
    const ex = x2
    const ey = y1

    const seg1     = Math.hypot(ex - x1, ey - y1)
    const seg2     = Math.abs(y2 - ey)
    const totalLen = Math.max(seg1 + seg2, 10)

    const g = document.createElementNS(NS, 'g')
    g.setAttribute('class', 'ann-group')
    g.style.opacity = '0'

    // Pulse ring
    const ring = document.createElementNS(NS, 'circle')
    ring.setAttribute('cx', x1)
    ring.setAttribute('cy', y1)
    ring.setAttribute('r', '5')
    ring.setAttribute('fill', 'none')
    ring.setAttribute('stroke', '#C9A84C')
    ring.setAttribute('stroke-width', '1.5')
    ring.innerHTML = `
      <animate attributeName="r" values="5;18;5" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite"/>
    `

    // Solid dot (on top, appended last)
    const dot = document.createElementNS(NS, 'circle')
    dot.setAttribute('cx', x1)
    dot.setAttribute('cy', y1)
    dot.setAttribute('r', '4.5')
    dot.setAttribute('fill', '#C9A84C')

    // Animated polyline
    const poly = document.createElementNS(NS, 'polyline')
    poly.setAttribute('points', `${x1},${y1} ${ex},${ey} ${x2},${y2}`)
    poly.setAttribute('fill', 'none')
    poly.setAttribute('stroke', '#C9A84C')
    poly.setAttribute('stroke-width', '1')
    poly.setAttribute('opacity', '0.8')
    poly.setAttribute('stroke-linecap', 'round')
    poly.setAttribute('data-drawn', 'true')
    poly.setAttribute('stroke-dasharray', `${totalLen}`)
    poly.setAttribute('stroke-dashoffset', `${totalLen}`)
    poly.innerHTML = `
      <animate attributeName="stroke-dashoffset"
        from="${totalLen}" to="0" dur="0.55s" fill="freeze"
        calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1"/>
    `
    // After the draw animation finishes, remove dasharray/dashoffset so
    // liveUpdate()'s points mutation cannot reset the animation
    setTimeout(() => {
      poly.removeAttribute('stroke-dasharray')
      poly.removeAttribute('stroke-dashoffset')
      poly.innerHTML = ''
    }, 650)

    // End tick
    const tick = document.createElementNS(NS, 'line')
    tick.setAttribute('x1', x2); tick.setAttribute('y1', y2 - 5)
    tick.setAttribute('x2', x2); tick.setAttribute('y2', y2 + 5)
    tick.setAttribute('stroke', '#C9A84C')
    tick.setAttribute('stroke-width', '1')
    tick.setAttribute('opacity', '0.65')

    // Label
    const labelW = 220
    const labelX = ann.side === 'right' ? x2 + 12 : x2 - labelW - 12
    const fo = document.createElementNS(NS, 'foreignObject')
    fo.setAttribute('x',       String(labelX))
    fo.setAttribute('y',       String(y2 - 22))
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
    g.appendChild(poly)
    g.appendChild(tick)
    g.appendChild(fo)
    g.appendChild(dot)  // dot last so it renders on top
    this.svg.appendChild(g)

    setTimeout(() => {
      g.style.transition = 'opacity 0.3s ease'
      g.style.opacity = '1'
    }, 60)
  }
}
