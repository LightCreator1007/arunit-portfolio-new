<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const isHome = computed(() => route.name === 'home')
const isProjects = computed(() => route.name === 'projects')
const isBlogish = computed(() => route.name === 'blogs' || route.name === 'post')

const navBase =
  'font-mono text-[clamp(11px,2.8vw,13px)] font-semibold tracking-[0.06em] ' +
  'py-[clamp(6px,1.6vw,8px)] px-[clamp(9px,2.2vw,16px)] border-[3px] border-ink ' +
  'no-underline inline-block transition-[transform,box-shadow] duration-150 ' +
  'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#1c1b18]'

const navState = (active: boolean) => (active ? 'bg-ink text-cream' : 'bg-transparent text-ink')
</script>

<template>
  <header
    class="sticky top-0 z-50 flex items-center justify-between gap-3 border-b-[3px] border-ink bg-cream px-[clamp(14px,3vw,28px)] py-[clamp(10px,2.4vw,14px)]"
  >
    <RouterLink to="/" class="flex min-w-0 items-center gap-3.5 no-underline">
      <div
        class="border-[3px] border-ink bg-mustard px-2.75 py-1 font-archivo text-[clamp(16px,4vw,19px)] text-ink shadow-[4px_4px_0_#1c1b18] transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#1c1b18]"
      >
        AC.
      </div>
      <div
        class="hidden font-mono text-[11px] leading-normal tracking-[0.08em] text-ink min-[600px]:block"
      >
        ARUNIT CHAKRABORTY
      </div>
    </RouterLink>

    <nav class="flex gap-[clamp(6px,1.5vw,10px)]">
      <RouterLink to="/" :class="[navBase, navState(isHome)]">HOME</RouterLink>
      <RouterLink to="/projects" :class="[navBase, navState(isProjects)]">PROJECTS</RouterLink>
      <RouterLink to="/blogs" :class="[navBase, navState(isBlogish)]">BLOG</RouterLink>
    </nav>
  </header>
</template>
