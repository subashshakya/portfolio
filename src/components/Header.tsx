import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { animate, stagger, utils } from 'animejs'
import { dur, ease } from '../motion'
import { profile } from '../data/resume'
import { TLink } from './Transition'

export const sections = [
  { id: 'work', label: 'Work', num: 'I' },
  { id: 'index', label: 'Index', num: 'II' },
  { id: 'experience', label: 'Experience', num: 'III' },
  { id: 'toolkit', label: 'Toolkit', num: 'IV' },
  { id: 'contact', label: 'Contact', num: 'V' },
]

function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.querySelector('meta[name=theme-color]')?.setAttribute('content', dark ? '#1d1712' : '#f2e9da')
    try { localStorage.setItem('theme', dark ? 'dark' : 'light') } catch { /* storage unavailable */ }
  }, [dark])
  return (
    <button
      onClick={() => setDark(d => !d)}
      className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2 transition-colors duration-[var(--dur-quick)] hover:text-ink"
      aria-label={`Switch to ${dark ? 'day' : 'dusk'} theme`}
    >
      <span className="relative h-3.5 w-3.5 overflow-hidden rounded-full border border-current">
        <span className="absolute inset-y-0 left-0 w-1/2 bg-current transition-transform duration-[var(--dur-base)] ease-[var(--ease)]" style={{ transform: dark ? 'translateX(100%)' : 'none' }} />
      </span>
      <span className="hidden sm:inline">{dark ? 'Dusk' : 'Day'}</span>
    </button>
  )
}

export function Header() {
  const bar = useRef<HTMLElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  // Slide away while reading downwards, return on the way back up.
  useEffect(() => {
    let last = window.scrollY
    let hidden = false
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      const hide = y > 140 && y > last
      if (hide !== hidden && Math.abs(y - last) > 4) {
        hidden = hide
        animate(bar.current!, { y: hide ? '-100%' : '0%', duration: dur.base, ease: ease.out })
      }
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const el = overlay.current!
    const links = el.querySelectorAll('[data-menu-item]')
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) {
      utils.set(el, { visibility: 'visible' })
      animate(el, { clipPath: ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)'], duration: dur.slow - 200, ease: ease.inOut })
      animate(links, { y: ['110%', '0%'], duration: dur.slow, ease: ease.out, delay: stagger(70, { start: 260 }) })
    } else if (el.style.visibility === 'visible') {
      animate(links, { y: '-110%', duration: dur.quick, ease: ease.inOut, delay: stagger(30) })
      animate(el, {
        clipPath: 'inset(0% 0% 100% 0%)', duration: dur.base + 100, delay: 160, ease: ease.inOut,
        onComplete: () => utils.set(el, { visibility: 'hidden' }),
      })
    }
  }, [open])

  return (
    <>
      <header ref={bar} className="fixed inset-x-0 top-0 z-50">
        <div className={`border-b bg-paper/92 backdrop-blur-sm transition-colors duration-[var(--dur-base)] ${scrolled ? 'border-rule' : 'border-transparent'}`}>
          <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-4 sm:px-8">
            <TLink to="/" label={profile.name} className="group flex items-baseline gap-3">
              <span className="font-display text-xl tracking-tight">Subash <em className="font-display italic">Shakya</em></span>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3 lg:inline">Software Engineer</span>
            </TLink>
            <nav className="hidden md:block">
              <ul className="flex items-center gap-7">
                {sections.map(s => (
                  <li key={s.id}>
                    <TLink to={`/#${s.id}`} className="group flex items-baseline gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2 transition-colors duration-[var(--dur-quick)] hover:text-ink">
                      <span className="text-rust">{s.num}.</span>
                      <span className="ink-link pb-0.5">{s.label}</span>
                    </TLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex items-center gap-5">
              <ThemeToggle />
              <button onClick={() => setOpen(o => !o)} aria-expanded={open} className="font-mono text-[11px] uppercase tracking-[0.16em] md:hidden">
                {open ? 'Close' : 'Menu'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        ref={overlay}
        className="fixed inset-0 z-40 flex flex-col justify-between bg-paper-2 px-5 pb-10 pt-24 md:hidden"
        style={{ visibility: 'hidden', clipPath: 'inset(0% 0% 100% 0%)' }}
      >
        <ul className="space-y-1">
          {sections.map(s => (
            <li key={s.id} className="overflow-hidden border-b border-rule">
              <div data-menu-item>
                <TLink to={`/#${s.id}`} onClick={() => setOpen(false)} className="flex items-baseline justify-between py-3">
                  <span className="font-display text-5xl italic">{s.label}</span>
                  <span className="font-mono text-xs text-rust">{s.num}</span>
                </TLink>
              </div>
            </li>
          ))}
        </ul>
        <div className="overflow-hidden">
          <a data-menu-item href={`mailto:${profile.email}`} className="block font-mono text-xs uppercase tracking-[0.16em] text-ink-2">{profile.email}</a>
        </div>
      </div>
    </>
  )
}
