<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { getNextPost, getPost, tagBg } from '../composables/useBlog'

const props = defineProps<{ slug: string }>()
const router = useRouter()

const post = computed(() => getPost(props.slug))
const next = computed(() => getNextPost(props.slug))

function openNext() {
  if (next.value) router.push(`/blogs/${next.value.slug}`)
}
</script>

<template>
  <div v-if="post">
    <header
      class="border-b-3px border-ink px-[clamp(18px,3.5vw,28px)] pt-[clamp(32px,6vw,48px)] pb-[clamp(40px,7vw,56px)]"
      :style="{ background: tagBg(post.tag) }"
    >
      <div class="mx-auto max-w-195">
        <RouterLink
          to="/blogs"
          class="inline-block cursor-pointer border-[3px] border-ink bg-paper px-3.5 py-1.75 font-mono text-[12px] font-bold tracking-widest text-ink no-underline shadow-[4px-4px_0_#1c1b18] transition-[transfrom, box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#1c1b18]"
        >
          &larr; ALL POSTS
        </RouterLink>

        <div
          class="mt-[clamp(24px,5vw,34px)] mb-5 flex flex-wrap items-center gap-3.5 font-mono text-[12px] font-semibold tracking-widest"
        >
          <div class="border-[2.5px] border-ink bg-paper px-2.75 py-1">{{ post.tag }}</div>
          <div>{{ post.date }}</div>
          <div>&middot;</div>
          <div>{{ post.mins }} MIN READ</div>
        </div>

        <h1
          class="m-0 mb-6.5 font-archivo text-[clamp(30px,5.5vw,60px)] leading-[1.08] text-balance"
        >
          {{ post.title }}
        </h1>
        <div class="font-mono text-[12px] tracking-[0.12em]">BY ARUNIT CHAKRABORTY</div>
      </div>
    </header>

    <article
      class="mx-auto max-w-195 px-[clamp(18px,3.5vw,28px)] pt-[clamp(36px,6vw,52px)] pb-[clamp(56px,8vw,80px)]"
    >
      <div class="prose" v-html="post.html"></div>

      <div v-if="next" v-reveal>
        <div
          :style="{ '--nsh': tagBg(next.tag) }"
          class="mt-14 flex cursor-pointer items-center justify-between gap-5 border-[3px] border-ink bg-paper px-[clamp(20px,4.5vw,28px)] py-[clamp(18px,4vw,24px)] shadow-[7px_7px_0_var(--nsh)] transition-[transform,box-shadow] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[11px_11px_0_#1c1b18]"
          @click="openNext"
        >
          <div>
            <div class="font-mono text-[11px] tracking-[0.14em] text-[#6e675b]">
              NEXT — {{ next.tag }}
            </div>
            <div class="mt-2 font-archivo text-[clamp(18px,4vw,23px)]">{{ next.title }}</div>
          </div>
          <div class="font-archivo text-[28px]">&rarr;</div>
        </div>
      </div>
    </article>
  </div>

  <div v-else class="mx-auto max-w-195 px-[clamp(18px,3.5vw,28px)] py-[clamp(48px,9vw,96px)]">
    <h1 class="m-0 mb-4.5 font-archivo text-[clamp(30px,5.5vw,60px)] leading-[1.08]">
      POST NOT FOUND
    </h1>
    <p class="mb-7 text-[18px] leading-[1.7]">That post doesn&rsquo;t exist (or was renamed).</p>
    <RouterLink
      to="/blogs"
      class="inline-block cursor-pointer border-[3px] border-ink bg-paper px-3.5 py-1.75 font-mono text-[12px] font-bold tracking-widest text-ink no-underline shadow-[4px_4px_0_#1c1b18] transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#1c1b18]"
    >
      &larr; ALL POSTS
    </RouterLink>
  </div>
</template>

<style scoped>
.prose :deep(p) {
  font-size: clamp(17px, 2.2vw, 18px);
  line-height: 1.7;
  margin: 0 0 26px;
}

.prose :deep(h1),
.prose :deep(h2) {
  font-family: var(--font-archivo);
  margin: 44px 0 18px;
}

.prose :deep(h2) {
  font-size: clamp(22px, 4vw, 27px);
}

.prose :deep(h1) {
  font-size: clamp(26px, 5vw, 34px);
}

.prose :deep(h3) {
  font-family: var(--font-archivo);
  font-size: clamp(19px, 3vw, 22px);
  margin: 34px 0 14px;
}

.prose :deep(ul),
.prose :deep(ol) {
  font-size: clamp(17px, 2.2vw, 18px);
  line-height: 1.7;
  margin: 0 0 26px;
  padding-left: 1.4em;
}

.prose :deep(li) {
  margin: 0 0 8px;
}

.prose :deep(a) {
  color: var(--color-ink);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.prose :deep(strong) {
  font-weight: 700;
}

.prose :deep(pre) {
  background: var(--color-ink);
  color: var(--color-cream);
  border: 3px solid var(--color-ink);
  box-shadow: 8px 8px 0 var(--color-mustard);
  padding: clamp(16px, 3.5vw, 24px) clamp(18px, 3.5vw, 26px);
  font-family: var(--font-mono);
  font-size: clamp(12px, 2vw, 14px);
  line-height: 1.65;
  overflow-x: auto;
  margin: 0 0 32px;
}

.prose :deep(pre code) {
  background: none;
  border: 0;
  padding: 0;
  font-size: inherit;
  color: inherit;
}

.prose :deep(:not(pre) > code) {
  font-family: var(--font-mono);
  font-size: 0.88em;
  background: #ede6d6;
  border: 1.5px solid var(--color-ink);
  padding: 1px 7px;
}

.prose :deep(blockquote) {
  border: 3px solid var(--color-ink);
  background: var(--color-lilac);
  box-shadow: 7px 7px 0 var(--color-ink);
  padding: clamp(22px, 4.5vw, 30px) clamp(24px, 5vw, 34px);
  margin: 40px 0;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(21px, 4vw, 27px);
  line-height: 1.35;
}

.prose :deep(blockquote p) {
  margin: 0;
  font-size: inherit;
  line-height: inherit;
}

.prose :deep(img) {
  display: block;
  max-width: 100%;
  height: auto;
  border: 3px solid var(--color-ink);
  margin: 0 0 32px;
}
</style>
