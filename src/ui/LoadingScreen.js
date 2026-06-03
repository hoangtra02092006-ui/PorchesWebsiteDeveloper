import gsap from 'gsap'

let _onComplete = null

export function initLoadingScreen(onComplete) {
  _onComplete = onComplete
}

export function updateLoadingBar(pct) {
  const fill = document.getElementById('loading-bar-fill')
  const label = document.getElementById('loading-pct')
  if (fill)  fill.style.width = pct + '%'
  if (label) label.textContent = pct + '%'
}

export function onLoadComplete() {
  gsap.to('#loading-screen', {
    opacity: 0,
    duration: 1.2,
    delay: 0.5,
    onComplete: () => {
      const el = document.getElementById('loading-screen')
      if (el) el.remove()

      // Animate hero panel in
      gsap.from('#s1 .panel', {
        y: 40,
        opacity: 0,
        duration: 1.4,
        delay: 0.1,
        ease: 'power3.out'
      })

      if (_onComplete) _onComplete()
    }
  })
}
