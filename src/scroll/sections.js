export const SECTIONS = [
  {
    id: 's1', name: 'Overview',
    camera: { x: 0, y: 1.0, z: 6.5 },
    lookAt: { x: 0, y: 0.4, z: 0 },
    rotY: 0,
    annotations: []
  },
  {
    id: 's2', name: 'Aerodynamics',
    camera: { x: -1.5, y: 2.0, z: 4.5 },
    lookAt: { x: 0, y: 1.0, z: -0.5 },
    rotY: Math.PI * 0.12,
    annotations: [
      { tipMarker: 'wing_top',    endX: 80, endY: 18, side: 'right',
        label: 'Swan Neck Wing Mount',   sublabel: 'Adjustable 3-position aluminum alloy' },
      { tipMarker: 'gurney_flap', endX: 80, endY: 42, side: 'right',
        label: 'Active Gurney Flap',     sublabel: '+15% downforce coefficient' },
      { tipMarker: 'diffuser',    endX: 80, endY: 62, side: 'right',
        label: 'Diffuser Exit',          sublabel: 'Manages underbody airflow separation' }
    ]
  },
  {
    id: 's3', name: 'Engine',
    camera: { x: 2.5, y: 0.8, z: 3.5 },
    lookAt: { x: 0.3, y: 0.4, z: 0 },
    rotY: -Math.PI * 0.28,
    annotations: [
      { tipMarker: 'throttle_body', endX: 18, endY: 25, side: 'left',
        label: 'Individual Throttle Bodies', sublabel: 'One per cylinder — instant response' },
      { tipMarker: 'engine_block',  endX: 18, endY: 48, side: 'left',
        label: 'Flat-Six Boxer Engine',      sublabel: '4.0L • Naturally aspirated • 510 hp' },
      { tipMarker: 'dry_sump',      endX: 18, endY: 68, side: 'left',
        label: 'Dry Sump Lubrication',       sublabel: 'Stable oil supply under 1.4g lateral G' }
    ]
  },
  {
    id: 's4', name: 'Brakes & Wheels',
    camera: { x: 3.0, y: 0.5, z: 3.0 },
    lookAt: { x: 1.0, y: 0.1, z: 0.8 },
    rotY: Math.PI * 0.42,
    annotations: [
      { tipMarker: 'brake_rotor', endX: 80, endY: 32, side: 'right',
        label: 'PCCB Carbon Ceramic Rotor',  sublabel: '420mm • 6-piston monobloc caliper' },
      { tipMarker: 'wheel_rim',   endX: 80, endY: 52, side: 'right',
        label: 'Centre-Lock Wheel',          sublabel: '21" rear • forged magnesium alloy' },
      { tipMarker: 'tire',        endX: 80, endY: 70, side: 'right',
        label: 'Michelin Pilot Sport Cup 2R', sublabel: '305/30 ZR21 — track compound' }
    ]
  },
  {
    id: 's5', name: 'Cockpit',
    camera: { x: 0, y: 2.8, z: 2.8 },
    lookAt: { x: 0, y: 0.8, z: 0 },
    rotY: 0,
    annotations: [
      { tipMarker: 'steering', endX: 75, endY: 20, side: 'right',
        label: 'GT Sport Steering Wheel', sublabel: 'Alcantara • integrated rev counter' },
      { tipMarker: 'seat',     endX: 75, endY: 45, side: 'right',
        label: 'Full Bucket Seat',        sublabel: 'Carbon fibre shell • 18-way adjustment' },
      { tipMarker: 'shifter',  endX: 22, endY: 30, side: 'left',
        label: 'PDK Gear Selector',       sublabel: '7-speed dual-clutch • 100ms shifts' }
    ]
  },
  {
    id: 's6', name: 'Finale',
    camera: { x: 0, y: 1.2, z: 7 },
    lookAt: { x: 0, y: 0.5, z: 0 },
    rotY: Math.PI * 2,
    annotations: []
  }
]
