export const SECTIONS = [
  {
    id: 's1',
    name: 'Overview',
    camera: { x: 0, y: 1.2, z: 7 },
    lookAt: { x: 0, y: 0.5, z: 0 },
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
        tipX: 61, tipY: 27,
        endX: 78, endY: 20,
        side: 'right',
        label: 'Swan Neck Wing Mount',
        sublabel: 'Adjustable 3-position aluminum alloy'
      },
      {
        tipX: 56, tipY: 34,
        endX: 78, endY: 40,
        side: 'right',
        label: 'Active Gurney Flap',
        sublabel: '+15% downforce coefficient'
      },
      {
        tipX: 65, tipY: 38,
        endX: 78, endY: 55,
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
        tipX: 40, tipY: 54,
        endX: 20, endY: 42,
        side: 'left',
        label: 'Flat-Six Boxer Engine',
        sublabel: '4.0L • Naturally aspirated • 510 hp'
      },
      {
        tipX: 44, tipY: 62,
        endX: 20, endY: 62,
        side: 'left',
        label: 'Dry Sump Lubrication',
        sublabel: 'Stable oil supply under 1.4g lateral G'
      },
      {
        tipX: 38, tipY: 46,
        endX: 20, endY: 30,
        side: 'left',
        label: 'Individual Throttle Bodies',
        sublabel: 'One per cylinder — instant response'
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
        tipX: 58, tipY: 66,
        endX: 76, endY: 58,
        side: 'right',
        label: 'PCCB Carbon Ceramic Rotor',
        sublabel: '420mm • 6-piston monobloc caliper'
      },
      {
        tipX: 54, tipY: 74,
        endX: 76, endY: 78,
        side: 'right',
        label: 'Centre-Lock Wheel',
        sublabel: '21" rear • forged magnesium alloy'
      },
      {
        tipX: 62, tipY: 72,
        endX: 76, endY: 68,
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
        tipX: 48, tipY: 40,
        endX: 70, endY: 30,
        side: 'right',
        label: 'GT Sport Steering Wheel',
        sublabel: 'Alcantara • integrated rev counter'
      },
      {
        tipX: 44, tipY: 50,
        endX: 70, endY: 52,
        side: 'right',
        label: 'Full Bucket Seat',
        sublabel: 'Carbon fibre shell • 18-way adjustment'
      },
      {
        tipX: 42, tipY: 38,
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
