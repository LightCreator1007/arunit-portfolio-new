import { onMounted, onUnmounted, ref } from 'vue'

const HELLOS = [
  'Hello.',
  'নমস্কার.',
  'Hola.',
  'नमस्ते.',
  'Bonjour.',
  'こんにちは.',
  'Olá.',
  'Hallo.',
  '안녕하세요.',
  'Ciao.',
]

export function useTypewriter() {
  const typed = ref('')
  let helloIdx = 0
  let deleting = false
  let timer: ReturnType<typeof setTimeout>

  function tick() {
    const word = Array.from(HELLOS[helloIdx % HELLOS.length]!)
    const current = Array.from(typed.value)
    let delay: number

    if (!deleting) {
      typed.value = word.slice(0, current.length + 1).join('')
      if (current.length + 1 >= word.length) {
        deleting = true
        delay = 1800
      } else {
        delay = 100
      }
    } else {
      const next = current.slice(0, -1).join('')
      typed.value = next
      if (next.length === 0) {
        deleting = false
        helloIdx += 1
        delay = 450
      } else {
        delay = 555
      }
    }

    timer = setTimeout(tick, delay)
  }

  onMounted(() => {
    timer = setTimeout(tick, 700)
  })

  onUnmounted(() => clearTimeout(timer))

  return { typed }
}
