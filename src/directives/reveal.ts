import type { Directive, DirectiveBinding } from 'vue'

interface RevealEl extends HTMLElement {
  __revealObserver?: IntersectionObserver
}

const reduceMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const vReveal: Directive<RevealEl, number | undefined> = {
  mounted(el, binding: DirectiveBinding<number | undefined>) {
    if (reduceMotion()) {
      el.classList.add('reveal-visible')
      return
    }

    el.classList.add('reveal')
    const stagger = typeof binding.value === 'number' ? binding.value : 0
    el.style.transitionDelay = `${stagger * 70}ms`

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle('reveal-visible', entry.isIntersecting)
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
