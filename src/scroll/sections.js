export const SECTIONS = [
  {
    id: 's1',
    name: 'Overview',
    camera: { x: 0, y: 1.0, z: 6.5 },
    lookAt: { x: 0, y: 0.4, z: 0 },
    rotY: 0,
    annotations: []
  },
  {
    id: 's2',
    name: 'Aerodynamics',
    camera: { x: -1.5, y: 2.0, z: 4.5 },
    lookAt: { x: 0, y: 1.0, z: -0.5 },
    rotY: Math.PI * 0.12,
    annotations: [
      {
        tip3D: { x: 0.0, y: 1.5, z: -1.1 },
        endX: 80, endY: 18,
        side: 'right',
        label: 'Swan Neck Wing Mount',
        sublabel: 'Adjustable 3-position aluminum alloy'
      },
      {
        tip3D: { x: 0.3, y: 0.6, z: -1.2 },
        endX: 80, endY: 42,
        side: 'right',
        label: 'Active Gurney Flap',
        sublabel: '+15% downforce coefficient'
      },
      {
        tip3D: { x: -0.2, y: 0.2, z: -1.0 },
        endX: 80, endY: 62,
        side: 'right',
        label: 'Diffuser Exit',
        sublabel: 'Manages underbody airflow separation'
      }
    ]
  },
  {
    id: 's3',
    name: 'Engine',
    camera: { x: 2.5, y: 0.8, z: 3.5 },
    lookAt: { x: 0.3, y: 0.4, z: 0 },
    rotY: -Math.PI * 0.28,
    annotations: [
      {
        tip3D: { x: -0.3, y: 0.9, z: -0.7 },
        endX: 18, endY: 28,
        side: 'left',
        label: 'Individual Throttle Bodies',
        sublabel: 'One per cylinder — instant response'
      },
      {
        tip3D: { x: 0.0, y: 0.7, z: -0.5 },
        endX: 18, endY: 48,
        side: 'left',
        label: 'Flat-Six Boxer Engine',
        sublabel: '4.0L • Naturally aspirated • 510 hp'
      },
      {
        tip3D: { x: 0.2, y: 0.3, z: -0.6 },
        endX: 18, endY: 68,
        side: 'left',
        label: 'Dry Sump Lubrication',
        sublabel: 'Stable oil supply under 1.4g lateral G'
      }
    ]
  },
  {
    id: 's4',
    name: 'Brakes & Wheels',
    camera: { x: 3.0, y: 0.5, z: 3.0 },
    lookAt: { x: 1.0, y: 0.1, z: 0.8 },
    rotY: Math.PI * 0.42,
    annotations: [
      {
        tip3D: { x: 0.85, y: 0.25, z: 0.8 },
        endX: 80, endY: 35,
        side: 'right',
        label: 'PCCB Carbon Ceramic Rotor',
        sublabel: '420mm • 6-piston monobloc caliper'
      },
      {
        tip3D: { x: 0.9, y: 0.18, z: 0.75 },
        endX: 80, endY: 55,
        side: 'right',
        label: 'Centre-Lock Wheel',
        sublabel: '21" rear • forged magnesium alloy'
      },
      {
        tip3D: { x: 0.85, y: 0.10, z: 0.85 },
        endX: 80, endY: 72,
        side: 'right',
        label: 'Michelin Pilot Sport Cup 2R',
        sublabel: '305/30 ZR21 — track compound'
      }
    ]
  },
  {
    id: 's5',
    name: 'Cockpit',
    camera: { x: 0, y: 2.8, z: 2.8 },
    lookAt: { x: 0, y: 0.8, z: 0 },
    rotY: 0,
    annotations: [
      {
        tip3D: { x: 0.2, y: 1.25, z: 0.1 },
        endX: 72, endY: 22,
        side: 'right',
        label: 'GT Sport Steering Wheel',
        sublabel: 'Alcantara • integrated rev counter'
      },
      {
        tip3D: { x: 0.3, y: 1.05, z: 0.2 },
        endX: 72, endY: 45,
        side: 'right',
        label: 'Full Bucket Seat',
        sublabel: 'Carbon fibre shell • 18-way adjustment'
      },
      {
        tip3D: { x: -0.15, y: 1.0, z: 0.3 },
        endX: 28, endY: 28,
        side: 'left',
        label: 'PDK Gear Selector',
        sublabel: '7-speed dual-clutch • 100ms shifts'
      }
    ]
  },
  {
    id: 's6',
    name: 'Finale',
    camera: { x: 0, y: 1.2, z: 7 },
    lookAt: { x: 0, y: 0.5, z: 0 },
    rotY: Math.PI * 2,
    annotations: []
  }
]
