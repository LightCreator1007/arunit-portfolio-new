import { computed, ref } from 'vue'
import MarkdownIt from 'markdown-it'

export type PostTag = 'TECH' | 'ESSAY'
export type BlogFilter = 'ALL' | PostTag

export interface Post {
  slug: string
  title: string
  tag: PostTag
  date: string
  iso: string
  mins: number
  blurb: string
  html: string
}

const MUSTARD = '#E3D3A3'
const LILAC = '#C9B8E8'
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const md = new MarkdownIt({ html: true, linkify: true, typographer: true })

function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(raw)
  if (!match) return { data: {}, content: raw }

  const data: Record<string, string> = {}

  for (const line of match[1]!.split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line
      .slice(idx + 1)
      .trim()
      .replace(/^["']|["']$/g, '')
    if (key) data[key] = value
  }
  return { data, content: match[2] ?? '' }
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return `${MONTHS[m - 1]} ${String(d).padStart(2, '0')}, ${y}`
}

function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function firstParagraph(content: string): string {
  for (const block of content.split(/\n\s*\n/)) {
    const text = block.trim()
    if (!text || text.startsWith('#') || text.startsWith('```') || text.startsWith('>')) continue
    return text.replace(/\s+/g, ' ')
  }
  return ''
}

function buildPost(path: string, raw: string): Post {
  const slug = path.split('/').pop()!.replace(/\.md$/, '')
  const { data, content } = parseFrontmatter(raw)

  const titleMatch = /^#\s+(.+?)\s*$/m.exec(content)
  const title = titleMatch ? titleMatch[1]! : slug
  const body = titleMatch ? content.replace(titleMatch[0], '') : content

  const tag: PostTag = data.tag === 'ESSAY' ? 'ESSAY' : 'TECH'
  const iso = data.date ?? ''

  return {
    slug,
    title,
    tag,
    iso,
    date: iso ? formatDate(iso) : '',
    mins: readingMinutes(body),
    blurb: data.blurb || firstParagraph(body),
    html: md.render(body),
  }
}

const modules = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export const posts: Post[] = Object.entries(modules)
  .map(([path, raw]) => buildPost(path, raw))
  .sort((a, b) => b.iso.localeCompare(a.iso))

export function tagBg(tag: PostTag): string {
  return tag === 'TECH' ? MUSTARD : LILAC
}

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getNextPost(slug: string): Post | undefined {
  const i = posts.findIndex((p) => p.slug === slug)
  if (i === -1 || posts.length < 2) return undefined
  return posts[(i + 1) % posts.length]
}

export function useBlog() {
  const filter = ref<BlogFilter>('ALL')
  const filtered = computed(() =>
    posts.filter((p) => filter.value === 'ALL' || p.tag === filter.value),
  )
  return { filter, filtered, posts, tagBg }
}
