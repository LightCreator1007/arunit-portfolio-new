<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBlog, type BlogFilter } from '../composables/useBlog'

const router = useRouter()
const { filter, filtered, posts, tagBg } = useBlog()

const filters: BlogFilter[] = ['ALL', 'TECH', 'ESSAY']
const count = computed(() => String(posts.length).padStart(2, '0'))

const filterClass = (active: boolean) => (active ? 'bg-ink text-cream' : 'bg-paper text-ink')

function open(slug: string) {
  router.push(`/blogs/${slug}`)
}
</script>

<template>
  <div
    class="mx-auto w-full max-w-290 px-[clamp(18px,3.5vw,28px)] pt-[clamp(36px,6vw,56px)] pb-[clamp(56px,8vw,88px)]"
  >
    <div class="flex items-center gap-2.5 font-mono text-[12px] tracking-[0.14em]">
      <div class="h-2.5 w-2.5 bg-ink"></div>
      <div>INDEX: 02 / WRITING</div>
    </div>

    <div class="mt-4.5 mb-7.5 flex flex-wrap items-baseline gap-5">
      <h1 class="m-0 font-archivo text-[clamp(44px,9vw,104px)] leading-none">BLOG</h1>
      <div
        class="font-archivo text-[clamp(26px,5vw,36px)] text-[#e8dfc9]"
        style="-webkit-text-stroke: 2px #1c1b18"
      >
        ({{ count }})
      </div>
    </div>

    <div class="mb-9 flex flex-wrap gap-2.5">
      <button
        v-for="f in filters"
        :key="f"
        type="button"
        class="cursor-pointer border-[3px] border-ink px-4 py-1.75 font-mono text-[12px] font-bold tracking-widest"
        :class="filterClass(filter === f)"
        @click="filter = f"
      >
        {{ f }}
      </button>
    </div>

    <div class="border-t-[3px] border-ink">
      <div v-for="(b, i) in filtered" :key="b.slug" v-reveal="i">
        <div
          class="grid cursor-pointer grid-cols-1 items-center gap-[clamp(10px,2vw,24px)] border-b-[3px] border-ink px-2.5 py-[clamp(20px,4vw,28px)] transition-[transform,background] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:translate-x-2.5 hover:bg-paper min-[720px]:grid-cols-[150px_1fr_auto_auto]"
          @click="open(b.slug)"
        >
          <div
            class="flex items-center gap-3.5 font-mono text-[12px] tracking-[0.08em] text-[#6e675b]"
          >
            <div>{{ b.date }}</div>
            <div
              class="border-[2.5px] border-ink px-2.25 py-0.75 text-[11px] font-bold tracking-[0.12em] text-ink min-[720px]:hidden"
              :style="{ background: tagBg(b.tag) }"
            >
              {{ b.tag }}
            </div>
            <div class="text-ink min-[720px]:hidden">{{ b.mins }} MIN</div>
          </div>

          <div class="min-w-0">
            <div class="text-[clamp(20px,4vw,25px)] leading-tight font-bold text-balance">
              {{ b.title }}
            </div>
            <div class="mt-1.5 max-w-[64ch] text-[15px] leading-tight text-[#555046]">
              {{ b.blurb }}
            </div>
          </div>

          <div
            class="hidden border-[2.5px] border-ink px-2.75 py-1 font-mono text-[11px] font-bold tracking-[0.12em] min-[720px]:block"
            :style="{ background: tagBg(b.tag) }"
          >
            {{ b.tag }}
          </div>
          <div
            class="hidden font-mono text-[12px] tracking-[0.08em] whitespace-nowrap min-[720px]:block"
          >
            {{ b.mins }} MIN &rarr;
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
