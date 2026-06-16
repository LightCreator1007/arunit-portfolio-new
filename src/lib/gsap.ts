import { gsap } from 'gsap'

export { gsap }

export function reduceMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export const EASE = {
  out: 'power3.out',
  soft: 'power2.out',
  inOut: 'sine.inOut',
} as const

export const DUR = {
  reveal: 0.65,
  intro: 0.7,
  page: 0.35,
  micro: 0.25,
} as const

export const DIST = {
  reveal: 24,
  intro: 28,
} as const
