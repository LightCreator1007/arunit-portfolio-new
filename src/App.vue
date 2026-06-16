<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import { createLenis, scrollToY } from './lib/lenis'
import { gsap, reduceMotion, EASE, DUR } from './lib/gsap'

let destroyLenis: (() => void) | undefined
onMounted(() => {
  destroyLenis = createLenis()
})
onUnmounted(() => destroyLenis?.())

function onPageEnter(el: Element, done: () => void) {
  scrollToY(0, true) // land the incoming page at the top before it fades in
  if (reduceMotion()) {
    done()
    return
  }
  gsap.fromTo(
    el,
    { opacity: 0 },
    { opacity: 1, duration: DUR.page, ease: EASE.soft, onComplete: done },
  )
}

function onPageLeave(el: Element, done: () => void) {
  if (reduceMotion()) {
    done()
    return
  }
  gsap.to(el, { opacity: 0, duration: DUR.page * 0.6, ease: EASE.soft, onComplete: done })
}
</script>

<template>
  <div class="flex min-h-screen flex-col overflow-x-clip bg-cream font-grotesk text-ink">
    <AppHeader />
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition :css="false" mode="out-in" appear @enter="onPageEnter" @leave="onPageLeave">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped></style>
