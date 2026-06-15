<script setup lang="ts">
const socialBase =
  'font-mono text-[13px] font-semibold tracking-[0.08em] border-[3px] border-cream ' +
  'py-2 px-4 cursor-pointer transition-colors duration-150'
</script>

<template>
  <footer
    class="border-t-[3px] border-ink bg-ink px-[clamp(18px,3.5vw,28px)] pt-[clamp(36px,6vw,52px)] pb-6.5 text-cream"
  >
    <div class="mx-auto max-w-310">
      <a
        href="mailto:arunitchakraborty2006@gmail.com"
        class="inline-block font-archivo text-[clamp(32px,7vw,80px)] leading-none text-cream no-underline transition-colors duration-150 hover:text-lilac"
      >
        LET&rsquo;S TALK &#8599;
      </a>

      <div class="my-[clamp(26px,5vw,36px)] flex flex-wrap gap-3">
        <a
          :class="[socialBase, 'hover:border-mustard hover:bg-mustard hover:text-ink']"
          href="https://github.com/LightCreator1007"
          >GITHUB &#8599;</a
        >
        <a
          :class="[socialBase, 'hover:border-lilac hover:bg-lilac hover:text-ink']"
          href="https://x.com/lucidSovereign"
          >X / TWITTER &#8599;</a
        >
        <a
          :class="[socialBase, 'hover:border-mustard hover:bg-mustard hover:text-ink']"
          href="www.linkedin.com/in/arunit-chakraborty"
          >LINKEDIN &#8599;</a
        >
        <a
          :class="[socialBase, 'hover:border-lilac hover:bg-lilac hover:text-ink']"
          href="mailto:arunitchakraborty2006@gmail.com"
          >EMAIL &#8599;</a
        >
      </div>

      <div
        class="flex flex-wrap justify-between gap-4 border-t border-cream/25 pt-5 font-mono text-[11px] tracking-widest text-[#b5ac9c]"
      >
        <div>&copy; 2026 ARUNIT CHAKRABORTY</div>
      </div>
    </div>
  </footer>
</template>
