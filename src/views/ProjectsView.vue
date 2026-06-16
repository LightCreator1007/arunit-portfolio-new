<script setup lang="ts">
import { computed } from 'vue'
import projectsData from '../content/projects.json'

interface ProjectInput {
  title: string
  year: string
  desc: string
  tags: string
  repo?: string
  live?: string
}

const MUSTARD = '#e3d3a3'
const LILAC = '#c9b8e8'

const projects = computed(() =>
  (projectsData as ProjectInput[]).map((p, i) => ({
    ...p,
    idx: String(i + 1).padStart(2, '0'),
    shadow: i % 2 === 0 ? MUSTARD : LILAC,
    // Prioritize the GitHub repo as the primary link
    href: p.repo || p.live || undefined,
    // Only surface a separate live button when both links exist
    liveHref: p.repo && p.live ? p.live : undefined,
  })),
)

const count = computed(() => String(projects.value.length).padStart(2, '0'))
</script>

<template>
  <div
    class="mx-auto w-full max-w-290 px-[clamp(18px,3.5vw,28px)] pt-[clamp(36px,6vw,56px)] pb-[clamp(56px,8vw,88px)]"
  >
    <div class="flex items-center gap-2.5 font-mono text-[12px] tracking-[0.14em]">
      <div class="h-2.5 w-2.5 bg-ink"></div>
      <div>INDEX — 01 / SELECTED WORK</div>
    </div>

    <div class="mt-4.5 mb-11 flex flex-wrap items-baseline gap-5">
      <h1 class="m-0 font-archivo text-[clamp(44px,9vw,104px)] leading-none">PROJECTS</h1>
      <div
        class="font-archivo text-[clamp(26px,5vw,36px)] text-[#e8dfc9]"
        style="-webkit-text-stroke: 2px #1c1b18"
      >
        ({{ count }})
      </div>
    </div>

    <div v-for="(p, i) in projects" :key="p.idx" v-reveal="i">
      <div
        :style="{ '--sh': p.shadow }"
        class="group relative mb-5.5 grid grid-cols-[clamp(52px,11vw,110px)_1fr_auto] items-center gap-[clamp(12px,3vw,28px)] border-[3px] border-ink bg-paper px-[clamp(16px,4vw,30px)] py-[clamp(16px,3.5vw,26px)] text-ink no-underline shadow-[7px_7px_0_var(--sh)] transition-[transform,box-shadow] duration-150 hover:-translate-x-1.25 hover:-translate-y-1.25 hover:shadow-[12px_12px_0_#1c1b18]"
        :class="p.href && 'cursor-pointer'"
      >
        <!-- Stretched primary link (GitHub repo when present) makes the whole card clickable -->
        <a
          v-if="p.href"
          :href="p.href"
          target="_blank"
          rel="noopener noreferrer"
          class="absolute inset-0 z-0"
          :aria-label="`Open ${p.title} repository`"
        ></a>

        <div
          class="font-archivo text-[clamp(34px,8vw,68px)] leading-none text-[#e8dfc9]"
          style="-webkit-text-stroke: 2.5px #1c1b18"
        >
          {{ p.idx }}
        </div>
        <div class="relative z-10 min-w-0 pointer-events-none">
          <div class="flex flex-wrap items-baseline gap-4">
            <div class="font-archivo text-[clamp(21px,4.5vw,29px)] text-ink">{{ p.title }}</div>
            <div class="font-mono text-[12px] tracking-widest text-[#6e675b]">{{ p.year }}</div>
          </div>
          <div class="mt-1.75 max-w-[62ch] text-[clamp(15px,2vw,16px)] leading-normal text-ink">
            {{ p.desc }}
          </div>
          <div class="mt-3 font-mono text-[12px] font-semibold tracking-widest text-[#6e675b]">
            {{ p.tags }}
          </div>
        </div>
        <div class="relative z-10 flex flex-col items-end gap-2.5 self-start">
          <div class="font-archivo text-[clamp(20px,4vw,30px)] text-ink pointer-events-none">
            &#8599;
          </div>
          <a
            v-if="p.liveHref"
            :href="p.liveHref"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 border-[2.5px] border-ink bg-lilac px-3 py-1.5 font-mono text-[11px] font-bold tracking-[0.14em] text-ink no-underline shadow-[3px_3px_0_#1c1b18] transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#1c1b18] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_#1c1b18]"
          >
            LIVE <span aria-hidden="true">&#8599;</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
