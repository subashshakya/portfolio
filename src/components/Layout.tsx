import type { ReactNode } from 'react'

export const wrap = 'mx-auto max-w-[1320px] px-4 sm:px-8'
export const pad = (n: number) => String(n).padStart(2, '0')

/** Section opener: a rule that draws across, a chapter numeral, and a title that rises word by word. */
export function Chapter({ num, title, note }: { num: string; title: ReactNode; note?: ReactNode }) {
  return (
    <header className="mb-12 sm:mb-16">
      <div data-reveal="line" className="h-px bg-ink/70" />
      <div className="mt-5 grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p data-reveal="fade" className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
            Chapter <span className="text-rust">{num}</span>
          </p>
          <h2 data-reveal="words" className="mt-3 font-display text-[clamp(3rem,8vw,6.5rem)] font-light leading-[0.95] tracking-[-0.02em]">
            {title}
          </h2>
        </div>
        {note && <p data-reveal="up" className="max-w-sm text-ink-2 md:col-span-4 md:justify-self-end">{note}</p>}
      </div>
    </header>
  )
}
