import Lenis from 'lenis'

let lenis: Lenis | null = null

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function getLenis(): Lenis | null {
  return lenis
}

export function createLenis(): () => void {
  if (prefersReducedMotion()) return () => {}
  lenis = new Lenis({
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  let frame = 0
  const raf = (time: number) => {
    lenis?.raf(time)
    frame = requestAnimationFrame(raf)
  }
  frame = requestAnimationFrame(raf)

  return () => {
    cancelAnimationFrame(frame)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToY(top: number, immediate = false): void {
  if (lenis) {
    lenis.scrollTo(top, { immediate })
  } else if (typeof window !== 'undefined') {
    window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' })
  }
}
