import { animate, createDrawable, cubicBezier, splitText, stagger, utils } from 'animejs'
import { useEffect, useRef } from 'react'

/**
 * One motion vocabulary for the whole site. The CSS custom properties in index.css
 * (--ease, --dur-*) mirror these values so hover states and scripted motion feel alike.
 */
export const ease = {
  /** Long, soft deceleration — like a leaf settling. Used for almost everything. */
  out: cubicBezier(0.22, 0.61, 0.36, 1),
  /** Symmetric, for things that travel (curtains, rules, lines being drawn). */
  inOut: cubicBezier(0.65, 0, 0.35, 1),
  drift: 'inOutSine',
} as const

export const dur = { quick: 320, base: 640, slow: 1100, slower: 1600, draw: 2400 } as const

export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── Page-transition gate: reveals wait until the curtain starts lifting. ── */
let gate: Promise<void> = Promise.resolve()
let openGate: () => void = () => {}
export function closeGate() { gate = new Promise(r => (openGate = r)) }
export function releaseGate() { openGate() }
export const whenPageVisible = () => gate

/* ── Scroll reveals ──
 * Mark elements with data-reveal="up | fade | words | line | vline | draw | count | children"
 * (optional data-delay in ms). useReveal() wires them up inside its root. */
type Runner = (delay: number) => void

function prepare(el: HTMLElement, cleanups: (() => void)[]): Runner {
  const kind = el.dataset.reveal || 'up'
  const style = el.getAttribute('style')
  cleanups.push(() => (style === null ? el.removeAttribute('style') : el.setAttribute('style', style)))

  switch (kind) {
    case 'words': {
      const split = splitText(el, { words: { wrap: 'clip' } })
      utils.set(split.words, { y: '125%' })
      cleanups.push(() => split.revert())
      return d => animate(split.words, { y: '0%', duration: dur.slower, ease: ease.out, delay: stagger(70, { start: d }) })
    }
    case 'vline':
      utils.set(el, { scaleY: 0, transformOrigin: '50% 0%' })
      return d => animate(el, { scaleY: 1, duration: dur.draw, ease: ease.inOut, delay: d })
    case 'line':
      utils.set(el, { scaleX: 0, transformOrigin: '0% 50%' })
      return d => animate(el, { scaleX: 1, duration: dur.slower, ease: ease.inOut, delay: d })
    case 'draw': {
      const paths = [...el.querySelectorAll<SVGPathElement>('path[data-draw]')]
      if (!paths.length) return () => {}
      const saved = paths.map(p => [p.getAttribute('style'), p.getAttribute('pathLength')] as const)
      const drawables = createDrawable(paths)
      utils.set(drawables, { draw: '0 0' })
      cleanups.push(() => paths.forEach((p, i) => {
        const [s, l] = saved[i]
        s === null ? p.removeAttribute('style') : p.setAttribute('style', s)
        l === null ? p.removeAttribute('pathLength') : p.setAttribute('pathLength', l)
      }))
      return d => animate(drawables, { draw: '0 1', duration: dur.draw, ease: ease.drift, delay: stagger(90, { start: d }) })
    }
    case 'count': {
      const to = Number(el.dataset.to ?? el.textContent)
      const text = el.textContent
      cleanups.push(() => (el.textContent = text))
      el.textContent = '0'
      return d => {
        const o = { v: 0 }
        animate(o, { v: to, duration: dur.slower, ease: ease.out, delay: d, onUpdate: () => (el.textContent = String(Math.round(o.v))) })
      }
    }
    case 'children': {
      const kids = [...el.children] as HTMLElement[]
      const saved = kids.map(k => k.getAttribute('style'))
      cleanups.push(() => kids.forEach((k, i) => (saved[i] === null ? k.removeAttribute('style') : k.setAttribute('style', saved[i]!))))
      utils.set(kids, { opacity: 0, y: 24 })
      return d => animate(kids, { opacity: 1, y: 0, duration: dur.slow, ease: ease.out, delay: stagger(80, { start: d }) })
    }
    case 'fade':
      utils.set(el, { opacity: 0 })
      return d => animate(el, { opacity: 1, duration: dur.slow, ease: ease.out, delay: d })
    default:
      utils.set(el, { opacity: 0, y: 32 })
      return d => animate(el, { opacity: 1, y: 0, duration: dur.slow, ease: ease.out, delay: d })
  }
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(deps: unknown[] = []) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const root = ref.current
    if (!root || prefersReduced()) return
    const els = [...root.querySelectorAll<HTMLElement>('[data-reveal]')].filter(el => !el.dataset.revealed)
    const cleanups: (() => void)[] = []
    const runners = new Map(els.map(el => [el, prepare(el, cleanups)]))
    let cancelled = false
    let queue: HTMLElement[] = []
    let raf = 0

    // Elements entering together are staggered as one gentle wave.
    const flush = () => {
      raf = 0
      queue.forEach((el, i) => {
        el.dataset.revealed = '1'
        runners.get(el)?.(i * 90 + Number(el.dataset.delay ?? 0))
      })
      queue = []
    }
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) { io.unobserve(e.target); queue.push(e.target as HTMLElement) }
      if (queue.length && !raf) raf = requestAnimationFrame(flush)
    }, { rootMargin: '0px 0px -8% 0px' })

    whenPageVisible().then(() => { if (!cancelled) els.forEach(el => io.observe(el)) })
    return () => {
      cancelled = true
      io.disconnect()
      cancelAnimationFrame(raf)
      // Restore inline styles / split text (StrictMode double-mount, list changes).
      cleanups.reverse().forEach(f => f())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return ref
}
