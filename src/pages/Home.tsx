import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { animate, createAnimatable, onScroll, splitText, stagger, utils } from 'animejs'
import { categories, education, experience, profile, projects, skills, type Category, type Project } from '../data/resume'
import { dur, ease, prefersReduced, useReveal, whenPageVisible } from '../motion'
import { Plate } from '../components/Plate'
import { TLink } from '../components/Transition'
import { Arrow, GithubIcon } from '../components/Icons'
import { Chapter, pad, wrap } from '../components/Layout'

const yearsExp = Math.floor((Date.now() - new Date('2023-06-01').getTime()) / (365.25 * 24 * 3600 * 1000))

export function Home() {
  const root = useReveal()

  // Scroll-synced parallax on plates: the image drifts a little slower than the page.
  useEffect(() => {
    if (prefersReduced()) return
    const anims = [...document.querySelectorAll<HTMLElement>('[data-parallax]')].map(el =>
      animate(el, { y: ['-5%', '5%'], ease: 'linear', autoplay: onScroll({ target: el.parentElement!, sync: 0.35 }) }),
    )
    return () => anims.forEach(a => a.revert())
  }, [])

  return (
    <div ref={root}>
      <Hero />
      <FocusMarquee />
      <SelectedWork />
      <ProjectIndex />
      <Experience />
      <Toolkit />
      <Contact />
    </div>
  )
}

/* ───────────── Hero ───────────── */

function Hero() {
  const name = useRef<HTMLHeadingElement>(null)
  const stamp = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReduced()) return
    const split = splitText(name.current!, { chars: { wrap: 'clip' } })
    utils.set(split.chars, { y: '125%' })
    let cancelled = false
    whenPageVisible().then(() => {
      if (!cancelled) animate(split.chars, { y: '0%', duration: dur.slower, ease: ease.out, delay: stagger(38, { start: 120 }) })
    })
    const spin = animate(stamp.current!, { rotate: 360, duration: 48000, ease: 'linear', loop: true })
    return () => { cancelled = true; split.revert(); spin.revert() }
  }, [])

  const stats = [
    { n: projects.length, l: 'Projects documented' },
    { n: yearsExp, l: 'Years in production', suffix: '+' },
    { n: experience.length, l: 'Companies' },
  ]

  return (
    <section className="pt-24 sm:pt-28">
      <div className={wrap}>
        <div data-reveal="fade" className="flex justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3 sm:text-[11px]">
          <span>Portfolio — {new Date().getFullYear()} edition</span>
          <span className="hidden sm:inline">{profile.location} · 27.67° N, 85.32° E</span>
          <span>Est. 2023</span>
        </div>
        <div data-reveal="line" className="mt-4 h-px bg-ink/70" />

        <h1
          ref={name}
          aria-label={profile.name}
          className="mt-6 font-display text-[clamp(4.25rem,17.5vw,16rem)] font-light leading-[0.82] tracking-[-0.045em] sm:mt-8"
        >
          <span className="block">Subash</span>
          <span className="block pl-[0.6em] italic text-rust">Shakya</span>
        </h1>

        <div className="mt-12 grid gap-14 md:mt-16 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5 md:pt-2">
            <p data-reveal="up" data-delay="500" className="font-display text-[1.65rem] leading-[1.25] sm:text-3xl">
              {profile.lede}
            </p>
            <p data-reveal="up" data-delay="600" className="mt-6 max-w-md text-ink-2">{profile.intro}</p>
            <div data-reveal="up" data-delay="700" className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <TLink to="/#work" className="group inline-flex items-center gap-3 bg-ink px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-paper transition-colors duration-[var(--dur-base)] hover:bg-rust">
                Selected work <Arrow className="w-7 transition-transform duration-[var(--dur-base)] ease-[var(--ease)] group-hover:translate-x-1.5" />
              </TLink>
              <a href={profile.github} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em]">
                <GithubIcon className="h-3.5 w-3.5" /> <span className="ink-link pb-0.5">GitHub</span>
              </a>
            </div>
          </div>

          <div className="relative md:col-span-6 md:col-start-7">
            <div data-reveal="fade" data-delay="300" className="overflow-hidden">
              <Plate seed="subash-shakya" tone="var(--rust)" caption="Fig. 0 — Lalitpur, in contour" aside="Plate I" className="aspect-[5/4]" />
            </div>
            <div ref={stamp} className="absolute -top-10 left-3 h-28 w-28 text-ink sm:-left-12 sm:h-32 sm:w-32" aria-hidden>
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <defs><path id="ring" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" /></defs>
                <circle cx="50" cy="50" r="49" fill="var(--paper)" />
                <text fontFamily="IBM Plex Mono, monospace" fontSize="7.4" fill="currentColor">
                  <textPath href="#ring" textLength="236" lengthAdjust="spacing">OPEN TO NEW WORK · BASED IN NEPAL · </textPath>
                </text>
                <text x="50" y="59" textAnchor="middle" fontFamily="Fraunces, serif" fontStyle="italic" fontSize="26" fill="var(--rust)">S</text>
              </svg>
            </div>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-3 border-y border-rule md:mt-24">
          {stats.map((s, i) => (
            <div key={s.l} className={`flex flex-col-reverse py-6 sm:py-8 ${i ? 'border-l border-rule pl-4 sm:pl-8' : ''}`}>
              <dt className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3 sm:text-[11px]">{s.l}</dt>
              <dd className="font-display text-5xl font-light sm:text-7xl">
                <span data-reveal="count" data-to={s.n}>{s.n}</span>{s.suffix}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* ───────────── Marquee ───────────── */

function FocusMarquee() {
  const track = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (prefersReduced()) return
    const el = track.current!
    const loop = animate(el, { x: ['0%', '-50%'], duration: 70000, ease: 'linear', loop: true })
    // Ease the speed down on hover rather than stopping dead.
    const slow = () => animate(loop, { speed: 0.15, duration: dur.slow, ease: ease.out })
    const resume = () => animate(loop, { speed: 1, duration: dur.slow, ease: ease.out })
    const host = el.parentElement!
    host.addEventListener('pointerenter', slow)
    host.addEventListener('pointerleave', resume)
    return () => { loop.revert(); host.removeEventListener('pointerenter', slow); host.removeEventListener('pointerleave', resume) }
  }, [])
  const items = [...profile.focus, ...profile.focus]
  return (
    <div className="mt-20 overflow-hidden border-y border-rule bg-paper-2 py-5 sm:mt-28">
      <div ref={track} className="flex w-max">
        {[0, 1].map(k => (
          <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {items.map((t, i) => (
              <span key={i} className="flex items-center whitespace-nowrap font-display text-3xl font-light italic sm:text-4xl">
                <span className="px-8">{t}</span>
                <span className="text-lg not-italic text-rust">❧</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ───────────── I. Selected work ───────────── */

function Feature({ p, i }: { p: Project; i: number }) {
  const n = projects.indexOf(p) + 1
  const m = p.metrics?.[0]
  return (
    <article className="grid items-center gap-8 border-t border-rule py-12 sm:py-16 md:grid-cols-12 md:gap-12">
      <TLink
        to={`/projects/${p.slug}`}
        label={p.name}
        color={p.tone}
        className={`group block overflow-hidden md:col-span-7 ${i % 2 ? 'md:order-2' : ''}`}
        aria-label={`${p.name} case study`}
      >
        <Plate seed={p.slug} tone={p.tone} caption={`Fig. ${pad(n)} — ${p.name}`} aside={p.org} parallax className="aspect-[4/3]" />
      </TLink>

      <div className={`md:col-span-5 ${i % 2 ? 'md:pr-6' : 'md:pl-2'}`}>
        <p data-reveal="fade" className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
          No. {pad(n)} <span className="mx-2 text-ink-3/50">/</span> {p.categories[0]}
        </p>
        <h3 data-reveal="words" className="mt-3 font-display text-[clamp(2.75rem,6vw,5rem)] font-light leading-[0.95] tracking-[-0.025em]">
          {p.name}
        </h3>
        <p data-reveal="up" className="mt-5 font-display text-xl italic leading-snug text-ink-2 sm:text-2xl">{p.tagline}</p>

        <dl data-reveal="children" className="mt-8 border-t border-rule pt-2 text-sm">
          {[
            ['Role', p.role],
            ['When', p.period],
            ['Built with', p.stack.slice(0, 6).join(', ')],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[6.5rem_1fr] py-1.5">
              <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">{k}</dt>
              <dd className={k === 'Built with' ? 'text-ink-2' : ''}>{v}</dd>
            </div>
          ))}
        </dl>

        {m && (
          <p data-reveal="up" className="mt-8 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
            <span className="font-display text-4xl font-light sm:text-5xl" style={{ color: p.tone }}>{m.value}</span>
            <span className="max-w-[14rem] text-sm text-ink-2">{m.label}</span>
          </p>
        )}

        <div data-reveal="up" className="mt-9">
          <TLink to={`/projects/${p.slug}`} label={p.name} color={p.tone} className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em]">
            <span className="ink-link pb-0.5">Read the case study</span>
            <Arrow className="w-8 transition-transform duration-[var(--dur-base)] ease-[var(--ease)] group-hover:translate-x-2" />
          </TLink>
        </div>
      </div>
    </article>
  )
}

function SelectedWork() {
  const featured = projects.filter(p => p.featured)
  return (
    <section id="work" className={`${wrap} scroll-mt-20 pt-28 sm:pt-40`}>
      <Chapter
        num="I"
        title={<>Selected <em className="italic text-rust">work</em></>}
        note="Six systems I'm proudest of. Each has a full case study: the problem, the architecture and what I built."
      />
      {featured.map((p, i) => <Feature key={p.slug} p={p} i={i} />)}
    </section>
  )
}

/* ───────────── II. Index ───────────── */

function ProjectIndex() {
  const [filter, setFilter] = useState<Category | 'All'>('All')
  const list = useMemo(() => (filter === 'All' ? projects : projects.filter(p => p.categories.includes(filter))), [filter])
  const [hovered, setHovered] = useState<Project | null>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const tabs = useRef<HTMLDivElement>(null)
  const underline = useRef<HTMLSpanElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const follower = useRef<ReturnType<typeof createAnimatable> | null>(null)
  const settled = useRef(false)
  const busy = useRef(false)

  // The underline glides to the active filter.
  useLayoutEffect(() => {
    const active = tabs.current?.querySelector<HTMLElement>('[data-active="true"]')
    if (!active || !underline.current) return
    const to = { x: active.offsetLeft, width: active.offsetWidth }
    if (!settled.current) utils.set(underline.current, to)
    else {
      animate(underline.current, { ...to, duration: dur.base, ease: ease.out })
      active.parentElement?.parentElement?.scrollTo({ left: active.offsetLeft - 40, behavior: 'smooth' })
    }
  }, [filter])

  // New rows rise in after a filter change.
  useLayoutEffect(() => {
    if (!settled.current) { settled.current = true; return }
    if (prefersReduced()) return
    animate(listRef.current!.children, { opacity: [0, 1], y: [18, 0], duration: dur.base + 160, ease: ease.out, delay: stagger(45) })
  }, [list])

  const choose = (c: Category | 'All') => {
    if (c === filter || busy.current) return
    if (prefersReduced()) { setFilter(c); return }
    busy.current = true
    animate(listRef.current!.children, {
      opacity: 0, y: -8, duration: dur.quick, ease: ease.inOut, delay: stagger(16),
      onComplete: () => { busy.current = false; setFilter(c) },
    })
  }

  // The preview plate trails the cursor with a soft lag.
  useEffect(() => {
    follower.current = createAnimatable(preview.current!, { x: dur.base + 160, y: dur.base + 160, ease: ease.out })
    return () => { follower.current?.revert() }
  }, [])
  useEffect(() => {
    animate(preview.current!, { opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.92, duration: dur.base, ease: ease.out })
  }, [hovered])

  return (
    <section id="index" className={`${wrap} scroll-mt-20 pt-28 sm:pt-40`}>
      <Chapter
        num="II"
        title={<>Index of <em className="italic text-rust">projects</em></>}
        note={`All ${projects.length} projects, from client work to weekend builds. Filter by area, and open any one to read its case study.`}
      />

      <div data-reveal="up" className="-mx-4 mb-4 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
        <div ref={tabs} className="relative flex w-max gap-6 pb-3 font-mono text-[11px] uppercase tracking-[0.14em]">
          {(['All', ...categories] as const).map(c => {
            const count = c === 'All' ? projects.length : projects.filter(p => p.categories.includes(c)).length
            return (
              <button
                key={c}
                data-active={filter === c}
                onClick={() => choose(c)}
                className={`whitespace-nowrap transition-colors duration-[var(--dur-quick)] ${filter === c ? 'text-ink' : 'text-ink-3 hover:text-ink-2'}`}
              >
                {c} <sup className="text-rust">{count}</sup>
              </button>
            )
          })}
          <span ref={underline} className="absolute bottom-0 left-0 h-px bg-rust" style={{ width: 0 }} />
        </div>
      </div>

      <div
        className="border-t border-ink/70"
        onPointerMove={e => { follower.current?.x(e.clientX); follower.current?.y(e.clientY) }}
        onPointerLeave={() => setHovered(null)}
      >
        <ul ref={listRef}>
          {list.map(p => {
            const n = projects.indexOf(p) + 1
            return (
              <li key={p.slug} className="border-b border-rule">
                <TLink
                  to={`/projects/${p.slug}`}
                  label={p.name}
                  color={p.tone}
                  onPointerEnter={e => e.pointerType === 'mouse' && setHovered(p)}
                  className="group grid grid-cols-[2.25rem_1fr_auto] items-baseline gap-x-3 py-4 sm:grid-cols-[3rem_1fr_auto] sm:py-5"
                >
                  <span className="font-mono text-[11px] text-ink-3">{pad(n)}</span>
                  <span className="flex min-w-0 items-baseline gap-4">
                    <span className="relative font-display text-[1.75rem] font-light leading-tight transition-transform duration-[var(--dur-base)] ease-[var(--ease)] group-hover:translate-x-5 sm:text-[2.6rem]">
                      <span
                        className="absolute -left-5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 scale-0 rounded-full transition-transform duration-[var(--dur-base)] ease-[var(--ease)] group-hover:scale-100"
                        style={{ background: p.tone }}
                      />
                      {p.name}
                    </span>
                    <span className="leader hidden sm:block" />
                  </span>
                  <span className="text-right font-mono text-[10px] uppercase tracking-[0.14em] text-ink-2 sm:text-[11px]">
                    {p.org === 'Personal' ? 'Personal' : p.org.split(' ')[0]}
                    <span className="hidden text-ink-3 md:inline"> · {p.org === 'Personal' ? 'Independent' : p.period.split(' — ')[0]}</span>
                  </span>
                  <span className="col-start-2 col-end-4 mt-1 text-sm text-ink-2 sm:max-w-xl">{p.tagline}</span>
                </TLink>
              </li>
            )
          })}
        </ul>
      </div>

      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-30 hidden w-72 lg:block"
        style={{ opacity: 0, marginLeft: 28, marginTop: -110 }}
      >
        {hovered && <Plate seed={hovered.slug} tone={hovered.tone} caption={hovered.categories[0]} reveal={false} className="aspect-[4/3] shadow-[0_30px_60px_-30px_rgba(42,31,23,0.6)]" />}
      </div>
    </section>
  )
}

/* ───────────── III. Experience ───────────── */

function Experience() {
  return (
    <section id="experience" className="mt-28 scroll-mt-20 bg-paper-2 py-28 sm:mt-40 sm:py-40">
      <div className={wrap}>
        <Chapter
          num="III"
          title={<>Experience, <em className="italic text-rust">in order</em></>}
          note={`${yearsExp}+ years building production software for clients in energy, legal-tech, media, mobility, pharma and e-commerce.`}
        />
        {experience.map(job => (
          <article key={job.company} className="grid gap-8 border-t border-rule py-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <p data-reveal="fade" className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">{job.period}</p>
              <h3 data-reveal="words" className="mt-3 font-display text-5xl font-light tracking-[-0.02em]">{job.company}</h3>
              <p data-reveal="fade" className="mt-2 font-display text-xl italic text-rust">{job.title}</p>
            </div>
            <div className="md:col-span-8">
              <p data-reveal="up" className="font-display text-2xl leading-snug">{job.summary}</p>
              <ol data-reveal="children" className="mt-8">
                {job.points.map((pt, i) => (
                  <li key={pt} className="grid grid-cols-[2.5rem_1fr] border-t border-rule py-3.5 text-ink-2">
                    <span className="pt-1 font-mono text-[11px] text-ink-3">{pad(i + 1)}</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ol>
              <p data-reveal="up" className="mt-2 border-t border-rule pt-5 leading-relaxed">
                <span className="mr-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">Projects</span>
                {job.projects.map((slug, i) => {
                  const p = projects.find(x => x.slug === slug)!
                  return (
                    <span key={slug}>
                      <TLink to={`/projects/${slug}`} label={p.name} color={p.tone} className="ink-link font-display text-lg italic hover:text-rust">{p.name}</TLink>
                      {i < job.projects.length - 1 && <span className="text-ink-3">, </span>}
                    </span>
                  )
                })}
              </p>
            </div>
          </article>
        ))}

        <div className="grid gap-6 border-t border-ink/70 pt-12 md:grid-cols-12 md:gap-8">
          <h3 data-reveal="up" className="font-display text-3xl font-light italic md:col-span-4">Education</h3>
          <ul data-reveal="children" className="md:col-span-8">
            {education.map(e => (
              <li key={e.school} className="grid gap-1 border-b border-rule py-4 sm:grid-cols-[1fr_auto] sm:gap-6">
                <span>
                  <span className="font-display text-xl">{e.school}</span>
                  <span className="block text-sm text-ink-2">{e.degree} · {e.place}</span>
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3 sm:pt-1.5">{e.period}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ───────────── IV. Toolkit ───────────── */

function Toolkit() {
  return (
    <section id="toolkit" className={`${wrap} scroll-mt-20 pt-28 sm:pt-40`}>
      <Chapter
        num="IV"
        title={<>The <em className="italic text-rust">toolkit</em></>}
        note="Model APIs and retrieval, cloud infrastructure, and the interfaces people use."
      />
      {skills.map(g => (
        <div key={g.group} className="grid gap-3 border-t border-rule py-7 md:grid-cols-12 md:gap-8">
          <h3 data-reveal="up" className="font-display text-2xl italic md:col-span-4">{g.group}</h3>
          <p data-reveal="up" className="text-lg leading-relaxed text-ink-2 md:col-span-8">
            {g.items.map((s, i) => (
              <span key={s}>
                <span className="text-ink">{s}</span>
                {i < g.items.length - 1 && <> <span className="mx-1 text-rust/70">·</span> </>}
              </span>
            ))}
          </p>
        </div>
      ))}
      <div className="grid gap-3 border-y border-rule py-7 md:grid-cols-12 md:gap-8">
        <h3 data-reveal="up" className="font-display text-2xl italic md:col-span-4">Beyond code</h3>
        <p data-reveal="up" className="text-lg leading-relaxed text-ink-2 md:col-span-8">
          Mentoring trainees through to hiring, estimating new projects with clients, code review, and security audits.
        </p>
      </div>
    </section>
  )
}

/* ───────────── V. Contact ───────────── */

function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { window.location.href = `mailto:${profile.email}` }
  }
  return (
    <section id="contact" className={`${wrap} scroll-mt-20 py-28 sm:py-40`}>
      <Chapter num="V" title={<>Let&apos;s work <em className="italic text-rust">together.</em></>} />
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-8">
          <p data-reveal="up" className="max-w-xl text-lg text-ink-2">
            I&apos;m open to full-time roles, freelance work and interesting problems, especially AI agents and real-time systems. Email is the fastest way to reach me.
          </p>
          <div data-reveal="up" className="mt-8">
            <a href={`mailto:${profile.email}`} className="group inline-block max-w-full font-display text-[clamp(1.5rem,5vw,3.75rem)] font-light italic leading-tight">
              <span className="ink-link break-all pb-1 transition-colors duration-[var(--dur-base)] group-hover:text-rust">{profile.email}</span>
            </a>
          </div>
          <div data-reveal="up" className="mt-6">
            <button onClick={copy} className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2 transition-colors duration-[var(--dur-quick)] hover:text-ink">
              {copied ? '✓ Copied to clipboard' : 'Copy address'}
            </button>
          </div>
        </div>
        <dl data-reveal="children" className="self-end md:col-span-4">
          {([
            ['Elsewhere', <a href={profile.github} target="_blank" rel="noreferrer" className="ink-link">github.com/subashshakya</a>],
            ['Telephone', <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="ink-link">{profile.phone}</a>],
            ['Based in', profile.location],
          ] as const).map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-4 border-t border-rule py-4">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">{k}</dt>
              <dd className="text-right">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
