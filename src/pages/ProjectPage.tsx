import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { animate, onScroll } from 'animejs'
import { projects, type Project } from '../data/resume'
import { dur, prefersReduced, useReveal } from '../motion'
import { Plate } from '../components/Plate'
import { TLink } from '../components/Transition'
import { Arrow } from '../components/Icons'
import { pad, wrap } from '../components/Layout'

const label = 'font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3 sm:text-[11px]'

export function ProjectPage() {
  const { slug } = useParams()
  const index = projects.findIndex(p => p.slug === slug)
  const project = projects[index]
  const root = useReveal([slug])

  useEffect(() => {
    document.title = project ? `${project.name} — Subash Shakya` : 'Subash Shakya — Software Engineer'
    return () => { document.title = 'Subash Shakya — Software Engineer' }
  }, [project])

  useEffect(() => {
    if (prefersReduced() || !root.current) return
    const anims = [
      ...[...root.current.querySelectorAll<HTMLElement>('[data-parallax]')].map(el =>
        animate(el, { y: ['-6%', '6%'], ease: 'linear', autoplay: onScroll({ target: el.parentElement!, sync: 0.35 }) }),
      ),
      // A single pulse travelling along the pipeline, like data moving through it.
      ...[...root.current.querySelectorAll<HTMLElement>('[data-flow-dot]')].map(el =>
        animate(el, { left: ['0%', '100%'], opacity: [{ to: 1, duration: 400 }, { to: 1, duration: 3200 }, { to: 0, duration: 400 }], duration: 4000, ease: 'inOutSine', loop: true, loopDelay: dur.slow, delay: dur.draw }),
      ),
    ]
    return () => anims.forEach(a => a.revert())
  }, [slug, root])

  if (!project) {
    return (
      <section className={`${wrap} grid min-h-[70vh] place-items-center pt-32 text-center`}>
        <div>
          <h1 className="font-display text-6xl font-light italic">Not in the index.</h1>
          <TLink to="/#index" className="group mt-8 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em]">
            <span className="ink-link">Back to all projects</span> <Arrow className="w-8" />
          </TLink>
        </div>
      </section>
    )
  }

  const p = project
  const next = projects[(index + 1) % projects.length]
  const prev = projects[(index - 1 + projects.length) % projects.length]
  let section = 0
  const sec = () => `§ ${++section}`

  return (
    <article ref={root} key={p.slug}>
      {/* ── Title block ── */}
      <header className={`${wrap} pt-24 sm:pt-28`}>
        <div data-reveal="fade" className={`flex flex-wrap items-center justify-between gap-3 ${label}`}>
          <TLink to="/#index" className="group inline-flex items-center gap-2 text-ink-2 hover:text-ink">
            <Arrow className="w-6 rotate-180 transition-transform duration-[var(--dur-base)] ease-[var(--ease)] group-hover:-translate-x-1.5" />
            <span className="ink-link">Index</span>
          </TLink>
          <span>No. {pad(index + 1)} of {projects.length} · {p.categories.join(' · ')}</span>
        </div>
        <div data-reveal="line" className="mt-4 h-px bg-ink/70" />

        <h1 data-reveal="words" className="mt-8 font-display text-[clamp(3.5rem,13vw,11rem)] font-light leading-[0.88] tracking-[-0.04em]">
          {p.name}
        </h1>
        <p data-reveal="up" data-delay="200" className="mt-6 max-w-3xl font-display text-2xl italic leading-snug text-ink-2 sm:text-4xl">
          {p.tagline}
        </p>

        <dl data-reveal="children" className="mt-12 grid grid-cols-2 border-y border-rule md:grid-cols-4">
          {[
            ['Role', p.role],
            ['Company', p.org === 'Personal' ? 'Independent' : p.org],
            ['Timeline', p.period],
            ['Discipline', p.categories.join(', ')],
          ].map(([k, v], i) => (
            <div key={k} className={`border-rule py-5 ${i % 2 ? 'border-l pl-4' : ''} ${i > 1 ? 'border-t md:border-t-0' : ''} ${i ? 'md:border-l md:pl-6' : ''}`}>
              <dt className={label}>{k}</dt>
              <dd className="mt-2">{v}</dd>
            </div>
          ))}
        </dl>

        {p.link && (
          <div data-reveal="up" className="mt-6">
            <a href={p.link.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em]">
              <span className="ink-link pb-0.5">Visit {p.link.label}</span>
              <Arrow className="w-7 -rotate-45 transition-transform duration-[var(--dur-base)] ease-[var(--ease)] group-hover:translate-x-1" />
            </a>
          </div>
        )}
      </header>

      {/* ── Plate ── */}
      <div className={`${wrap} mt-12 sm:mt-16`}>
        <div data-reveal="fade" className="overflow-hidden">
          <Plate seed={p.slug} tone={p.tone} caption={`Fig. ${pad(index + 1)} — ${p.name}`} aside={p.org} parallax className="aspect-[4/3] sm:aspect-[21/9]" />
        </div>
      </div>

      {/* ── Figures ── */}
      {p.metrics && (
        <div className={`${wrap} mt-12 sm:mt-16`}>
          <dl data-reveal="children" className={`grid border-b border-rule ${['', 'sm:grid-cols-1', 'sm:grid-cols-2', 'sm:grid-cols-3'][p.metrics.length]}`}>
            {p.metrics.map((m, i) => (
              <div key={m.label} className={`py-6 ${i ? 'border-t border-rule sm:border-t-0 sm:border-l sm:pl-8' : ''}`}>
                <dd className="font-display text-5xl font-light sm:text-6xl" style={{ color: p.tone }}>{m.value}</dd>
                <dt className="mt-2 max-w-[18rem] text-sm text-ink-2">{m.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* ── Body ── */}
      <div className={`${wrap} py-20 sm:py-28`}>
        <Row label={`${sec()} Overview`}>
          <p data-reveal="up" className="font-display text-2xl font-light leading-[1.35] sm:text-[2rem]">{p.overview}</p>
        </Row>

        <Row label={`${sec()} The problem`}>
          <blockquote data-reveal="up" className="border-l-2 pl-6 text-lg leading-relaxed text-ink-2 sm:text-xl" style={{ borderColor: p.tone }}>
            {p.challenge}
          </blockquote>
        </Row>

        {p.flow && (
          <Row label={`${sec()} How it works`}>
            <h3 data-reveal="words" className="font-display text-3xl font-light italic sm:text-4xl">{p.flow.title}</h3>
            <Flow project={p} />
          </Row>
        )}

        <Row label={`${sec()} What I built`}>
          <ol className="grid gap-x-10 sm:grid-cols-2">
            {p.highlights.map((h, i) => (
              <li key={h.title} data-reveal="up" className="border-t border-rule py-6">
                <span className="font-display text-lg italic" style={{ color: p.tone }}>{pad(i + 1)}.</span>
                <h4 className="mt-1 font-display text-2xl leading-tight">{h.title}</h4>
                <p className="mt-2 leading-relaxed text-ink-2">{h.body}</p>
              </li>
            ))}
          </ol>
        </Row>

        <Row label={`${sec()} Built with`} last>
          <p data-reveal="up" className="text-xl leading-relaxed">
            {p.stack.map((s, i) => (
              <span key={s}>
                {s}
                {i < p.stack.length - 1 && <> <span className="mx-1.5" style={{ color: p.tone }}>·</span> </>}
              </span>
            ))}
          </p>
        </Row>
      </div>

      {/* ── Onwards ── */}
      <div className={wrap}>
        <div className="flex items-center justify-between border-t border-rule py-5">
          <TLink to={`/projects/${prev.slug}`} label={prev.name} color={prev.tone} className={`group inline-flex items-center gap-3 ${label} hover:text-ink`}>
            <Arrow className="w-6 rotate-180 transition-transform duration-[var(--dur-base)] ease-[var(--ease)] group-hover:-translate-x-1.5" />
            <span className="ink-link">{prev.name}</span>
          </TLink>
          <span className={label}>Next case study</span>
        </div>
      </div>
      <TLink to={`/projects/${next.slug}`} label={next.name} color={next.tone} className="group relative block overflow-hidden">
        <Plate seed={next.slug} tone={next.tone} reveal={false} className="h-[46vh] min-h-[300px]" />
        <div className={`${wrap} absolute inset-0 flex flex-col justify-end pb-10 text-paper sm:pb-14`}>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-80">No. {pad(projects.indexOf(next) + 1)} · {next.categories[0]}</p>
          <p className="mt-3 flex items-end justify-between gap-6">
            <span className="font-display text-[clamp(3rem,10vw,8rem)] font-light italic leading-[0.9] tracking-[-0.03em] transition-transform duration-[var(--dur-slow)] ease-[var(--ease)] group-hover:translate-x-3">
              {next.name}
            </span>
            <Arrow className="mb-4 w-14 shrink-0 transition-transform duration-[var(--dur-base)] ease-[var(--ease)] group-hover:translate-x-2 sm:w-20" />
          </p>
        </div>
      </TLink>
    </article>
  )
}

function Row({ label: l, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <section className={`grid gap-6 border-t border-rule py-12 md:grid-cols-12 md:gap-8 ${last ? 'border-b' : ''}`}>
      <h2 data-reveal="fade" className={`${label} md:col-span-3`}>{l}</h2>
      <div className="md:col-span-9">{children}</div>
    </section>
  )
}

function Flow({ project: p }: { project: Project }) {
  const steps = p.flow!.steps
  return (
    <ol className="relative mt-10 grid lg:grid-flow-col lg:auto-cols-fr">
      <span data-reveal="line" className="absolute inset-x-0 top-[11px] hidden h-px lg:block" style={{ background: p.tone }}>
        <span data-flow-dot className="absolute -top-[3px] h-[7px] w-[7px] -translate-x-1/2 rounded-full opacity-0" style={{ background: p.tone, boxShadow: `0 0 0 4px var(--paper)` }} />
      </span>
      <span data-reveal="vline" className="absolute bottom-6 left-[11px] top-3 w-px lg:hidden" style={{ background: p.tone }} />
      {steps.map((s, i) => (
        <li key={s.name} data-reveal="up" className="relative pb-8 pl-11 lg:pb-0 lg:pl-0 lg:pr-5 lg:pt-11">
          <span
            className="absolute left-0 top-0 grid h-[23px] w-[23px] place-items-center rounded-full border bg-paper font-mono text-[9px]"
            style={{ borderColor: p.tone, color: p.tone }}
          >
            {i + 1}
          </span>
          <p className="font-display text-xl leading-tight">{s.name}</p>
          <p className="mt-1 text-sm text-ink-2">{s.detail}</p>
        </li>
      ))}
    </ol>
  )
}
