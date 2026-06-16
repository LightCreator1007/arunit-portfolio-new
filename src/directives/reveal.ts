import type { Directive, DirectiveBinding } from 'vue'
import { gsap, reduceMotion, EASE, DUR, DIST } from '@/lib/gsap'

interface RevealEl extends HTMLElement {
  __revealObserver?: IntersectionObserver
}

// Optional binding value is an index used to stagger a group of siblings.
export const vReveal: Directive<RevealEl, number | undefined> = {
  beforeMount(el) {
    if (reduceMotion()) return
    // Hide before the element is painted so it never flashes in unanimated.
    gsap.set(el, { opacity: 0, y: DIST.reveal })
  },
  mounted(el, binding: DirectiveBinding<number | undefined>) {
    if (reduceMotion()) return

    const index = typeof binding.value === 'number' ? binding.value : 0
    const delay = Math.min(index * 0.06, 0.3)

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            duration: DUR.reveal,
            ease: EASE.out,
            delay,
          })
          obs.unobserve(entry.target) // reveal once, then stop watching
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(el)
    el.__revealObserver = observer
  },
  unmounted(el) {
    el.__revealObserver?.disconnect()
  },
}
