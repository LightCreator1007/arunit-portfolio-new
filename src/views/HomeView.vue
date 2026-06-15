<script setup lang="ts">
import { useTypewriter } from '@/composables/useTypewriter'
import catImg from '../assets/cat.png'

const { typed } = useTypewriter()

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
  { label: 'Javascrip', bg: '' },
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
        <div v-reveal class="relative z-2">
          <div
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
            class="mt-1.5 mb-9 font-archivo text-[clamp(34px,8.5vw,86px)] leading-[1.02] tracking-[-0.01em]"
          >
            ARUNIT<br />CHAKRABORTY
          </h1>

          <p
            class="my-8 mb-7 max-w-[min(52ch,calc(100%-36vw))] min-w-[min(100%,34ch)] text-[17px] leading-[1.65]"
          >
            Third-year CS student. I build fullstack things with TypeScript, and lately I&rsquo;ve
            been letting Rust and Go ruin my sleep schedule. Currently looking for a summer
            &rsquo;26 internship.
          </p>

          <div
            class="flex max-w-[min(520px,calc(100%-36vw))] min-w-[min(100%,300px)] flex-wrap gap-2.5"
          >
            <div
              v-for="skill in skills"
              :key="skill.label"
              class="border-[2.5px] border-ink px-3 py-1.25 font-mono text-[12px] font-semibold tracking-[0.08em]"
              :class="skill.bg"
            >
              {{ skill.label }}
            </div>
          </div>
        </div>

        <div
          class="relative z-1 mx-auto mt-10 w-[min(430px,100%)] min-[720px]:absolute min-[720px]:top-1/2 min-[720px]:right-0 min-[720px]:mx-0 min-[720px]:mt-0 min-[720px]:w-[min(34vw,430px)] min-[720px]:-translate-y-1/2"
        >
          <figure
            class="m-0 w-full rotate-[1.2deg] border-[3px] border-ink bg-paper p-[clamp(16px,3vw,24px)] shadow-[8px_8px_0_#e3d3a3] transition-transform duration-200 hover:rotate-0"
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
