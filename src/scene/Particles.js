import * as THREE from 'three'

export class Particles {
  constructor(scene) {
    const count = 400
    const positions = new Float32Array(count * 3)
    this.speeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 16
      positions[i * 3 + 1] = Math.random() * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16
      this.speeds[i] = 0.1 + Math.random() * 0.15
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: '#C9A84C',
      size: 0.02,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    })

    this.points = new THREE.Points(geometry, material)
    this.posAttr = geometry.attributes.position
    scene.add(this.points)
  }

  update(delta) {
    const pos = this.posAttr.array
    for (let i = 0; i < this.speeds.length; i++) {
      pos[i * 3 + 1] += this.speeds[i] * delta
      if (pos[i * 3 + 1] > 12) pos[i * 3 + 1] = 0
    }
    this.posAttr.needsUpdate = true
  }
}
