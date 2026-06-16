<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useTypewriter } from '@/composables/useTypewriter'
import { gsap, reduceMotion, EASE, DUR, DIST } from '@/lib/gsap'
import catImg from '../assets/cat.png'

const { typed } = useTypewriter()

const echoRef = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const descRef = ref<HTMLElement>()
const chipsRef = ref<HTMLElement>()
const catEnterRef = ref<HTMLElement>()
const catTiltRef = ref<HTMLElement>()
const catFloatRef = ref<HTMLElement>()
const catFigureRef = ref<HTMLElement>()

let ctx: ReturnType<typeof gsap.context> | undefined
const cleanups: Array<() => void> = []

onMounted(() => {
  if (reduceMotion()) return

  ctx = gsap.context(() => {
    const chips = gsap.utils.toArray<HTMLElement>(chipsRef.value!.children)

    // Hero entrance: a quick, staggered settle of each piece into place.
    gsap
      .timeline({ defaults: { ease: EASE.out, duration: DUR.intro } })
      .from(echoRef.value!, { y: 24, opacity: 0 })
      .from(titleRef.value!, { y: DIST.intro, opacity: 0 }, '-=0.42')
      .from(descRef.value!, { y: 20, opacity: 0 }, '-=0.5')
      .from(chips, { y: 16, opacity: 0, stagger: 0.05, duration: 0.5 }, '-=0.45')
      .from(catEnterRef.value!, { y: 32, opacity: 0, duration: 0.8 }, '-=0.7')

    // ---- Cat card: layered micro-interactions ----
    const tilt = catTiltRef.value!
    const figure = catFigureRef.value!

    // Idle: a slow vertical bob plus a gentle rotation sway on a different
    // period, so the resting motion reads organic rather than mechanical.
    gsap.to(catFloatRef.value!, { y: -10, duration: 3.6, ease: EASE.inOut, repeat: -1, yoyo: true })
    gsap.fromTo(
      catFloatRef.value!,
      { rotation: -0.9 },
      { rotation: 0.9, duration: 4.6, ease: EASE.inOut, repeat: -1, yoyo: true },
    )

    // Interactive: tilt the card in 3D toward the cursor and lift it on hover.
    // Pointer-fine devices only — a tilt that chases a touch point feels wrong.
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const MAX = 8
      gsap.set(tilt, { transformPerspective: 820, transformOrigin: 'center' })
      gsap.set(figure, { boxShadow: '8px 8px 0px #e3d3a3' }) // clean baseline so the shadow tween is smooth

      const rotX = gsap.quickTo(tilt, 'rotationX', { duration: 0.5, ease: EASE.out })
      const rotY = gsap.quickTo(tilt, 'rotationY', { duration: 0.5, ease: EASE.out })

      const onMove = (e: PointerEvent) => {
        const r = tilt.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        rotX(gsap.utils.clamp(-MAX, MAX, (py - 0.5) * 2 * MAX))
        rotY(gsap.utils.clamp(-MAX, MAX, -(px - 0.5) * 2 * MAX))
      }
      const onEnter = () => {
        gsap.to(tilt, { scale: 1.03, duration: 0.4, ease: EASE.soft })
        gsap.to(figure, { boxShadow: '16px 16px 0px #1c1b18', duration: 0.4, ease: EASE.soft })
      }
      const onLeave = () => {
        rotX(0)
        rotY(0)
        gsap.to(tilt, { scale: 1, duration: 0.5, ease: EASE.soft })
        gsap.to(figure, { boxShadow: '8px 8px 0px #e3d3a3', duration: 0.5, ease: EASE.soft })
      }

      tilt.addEventListener('pointerenter', onEnter)
      tilt.addEventListener('pointermove', onMove)
      tilt.addEventListener('pointerleave', onLeave)
      cleanups.push(() => {
        tilt.removeEventListener('pointerenter', onEnter)
        tilt.removeEventListener('pointermove', onMove)
        tilt.removeEventListener('pointerleave', onLeave)
      })
    }

    // Micro: skill chips lift on hover.
    chips.forEach((chip) => {
      const enter = () =>
        gsap.to(chip, { y: -4, scale: 1.05, duration: DUR.micro, ease: EASE.soft })
      const leave = () => gsap.to(chip, { y: 0, scale: 1, duration: DUR.micro, ease: EASE.soft })
      chip.addEventListener('mouseenter', enter)
      chip.addEventListener('mouseleave', leave)
      cleanups.push(() => {
        chip.removeEventListener('mouseenter', enter)
        chip.removeEventListener('mouseleave', leave)
      })
    })
  })
})

onUnmounted(() => {
  cleanups.forEach((fn) => fn())
  ctx?.revert()
})

const heroGrid = {
  backgroundImage:
    'linear-gradient(rgba(28,27,24,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(28,27,24,0.07) 1px, transparent 1px)',
  backgroundSize: '36px 36px',
}
const cardGrid = {
  backgroundImage:
    'linear-gradient(rgba(28,27,24,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(28,27,24,0.05) 1px, transparent 1px)',
  backgroundSize: '22px 22px',
}

const skills = [
  { label: 'C++', bg: '' },
  { label: 'python', bg: '' },
  { label: 'Javascript', bg: '' },
  { label: 'Golang', bg: '' },
  { label: 'React', bg: '' },
  { label: 'Vue', bg: '' },
  { label: 'Node', bg: '' },
  { label: 'SQL', bg: '' },
  { label: 'MongoDB', bg: '' },
]

const tickerText =
  'FULLSTACK DEVELOPER ✦ TYPESCRIPT ✦ REACT ✦ RUST ✦ GO ✦ POSTGRES ✦ OPEN TO INTERNSHIPS ✦ '
const tickerHalf = tickerText.repeat(2)
</script>

<template>
  <div>
    <section
      class="px-[clamp(18px,3.5vw,28px)] pt-[clamp(40px,7vw,72px)] pb-[clamp(48px,8vw,80px)]"
      :style="heroGrid"
    >
      <div class="relative mx-auto max-w-310">
        <div class="relative z-2">
          <div
            ref="echoRef"
            class="inline-flex max-w-full min-w-[min(320px,100%)] items-baseline gap-3.5 border-[3px] border-ink bg-paper px-[clamp(16px,3vw,22px)] py-[clamp(12px,2.5vw,16px)] font-mono text-[clamp(20px,4.5vw,32px)] font-semibold shadow-[7px_7px_0_#c9b8e8]"
          >
            <span class="text-[0.65em] text-[#9a9183]">$ echo</span>
            <span class="min-h-[1.2em]"
              >{{ typed
              }}<span
                class="ml-1.25 inline-block h-[1em] w-[0.5em] animate-[blink_1.1s_steps(1)_infinite] bg-ink align-[-0.08em]"
              ></span
            ></span>
          </div>

          <h1
            ref="titleRef"
            class="mt-9 mb-3 font-archivo text-[clamp(34px,8.5vw,86px)] leading-[1.02] tracking-[-0.01em]"
          >
            ARUNIT<br />CHAKRABORTY
          </h1>

          <p
            ref="descRef"
            class="my-8 mb-7 max-w-[min(52ch,calc(100%-36vw))] min-w-[min(100%,34ch)] text-[17px] leading-[1.65]"
          >
            Third-year CS student. I build fullstack things with TypeScript, and lately I&rsquo;ve
            been letting Rust and Go ruin my sleep schedule. Currently looking for a summer
            &rsquo;26 internship.
          </p>

          <div
            ref="chipsRef"
            class="flex max-w-[min(520px,calc(100%-36vw))] min-w-[min(100%,300px)] flex-wrap gap-2.5"
          >
            <div
              v-for="skill in skills"
              :key="skill.label"
              class="cursor-default border-[2.5px] border-ink px-3 py-1.25 font-mono text-[12px] font-semibold tracking-[0.08em] will-change-transform"
              :class="skill.bg"
            >
              {{ skill.label }}
            </div>
          </div>
        </div>

        <div
          class="relative z-1 mx-auto mt-10 w-[min(430px,100%)] min-[720px]:absolute min-[720px]:top-1/2 min-[720px]:right-0 min-[720px]:mx-0 min-[720px]:mt-0 min-[720px]:w-[min(34vw,430px)] min-[720px]:-translate-y-1/2"
        >
          <div ref="catEnterRef">
            <div ref="catTiltRef" class="will-change-transform">
              <div ref="catFloatRef" class="will-change-transform">
                <figure
                  ref="catFigureRef"
                  class="m-0 w-full rotate-[1.2deg] border-[3px] border-ink bg-paper p-[clamp(16px,3vw,24px)] shadow-[8px_8px_0_#e3d3a3]"
                  :style="cardGrid"
                >
                  <img
                    :src="catImg"
                    alt="A black cat in a red polka-dot bow tie"
                    class="block h-auto max-h-90 w-full object-contain"
                  />
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div
      v-reveal
      class="overflow-hidden border-t-[3px] border-b-[3px] border-ink bg-ink py-3.25 font-archivo text-[clamp(15px,3vw,19px)] tracking-wider text-cream"
    >
      <div
        class="flex animate-[marquee_32s_linear_infinite] whitespace-nowrap will-change-transform"
      >
        <span class="inline-block pr-[0.6em]">{{ tickerHalf }}</span>
        <span class="inline-block pr-[0.6em]">{{ tickerHalf }}</span>
      </div>
    </div>
  </div>
</template>
