import { useMemo } from 'react'

/** Small deterministic PRNG so each project's terrain is stable between renders. */
function rng(seed: string) {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 3432918353), (h = (h << 13) | (h >>> 19))
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

/** Closed Catmull-Rom spline through points → smooth SVG path. */
function smooth(pts: [number, number][]) {
  const n = pts.length
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`
  }
  return d + 'Z'
}

function contours(seed: string, w: number, h: number) {
  const r = rng(seed)
  const hills = 1 + Math.floor(r() * 2)
  const paths: string[] = []
  for (let k = 0; k < hills; k++) {
    const cx = w * (0.25 + r() * 0.5), cy = h * (0.3 + r() * 0.45)
    const waves = [0, 1, 2].map(() => ({ f: 2 + Math.floor(r() * 4), a: 0.06 + r() * 0.12, p: r() * Math.PI * 2 }))
    const rings = k === 0 ? 14 : 8
    const base = Math.min(w, h) * (k === 0 ? 0.05 : 0.04)
    const step = Math.min(w, h) * (k === 0 ? 0.075 : 0.05)
    for (let i = 0; i < rings; i++) {
      const rad = base + i * step
      const pts: [number, number][] = []
      for (let s = 0; s < 40; s++) {
        const t = (s / 40) * Math.PI * 2
        const wob = waves.reduce((acc, wv) => acc + wv.a * Math.sin(wv.f * t + wv.p + i * 0.18), 0)
        const rr = rad * (1 + wob)
        pts.push([cx + Math.cos(t) * rr * 1.35, cy + Math.sin(t) * rr])
      }
      paths.push(smooth(pts))
    }
  }
  return paths
}

/**
 * A topographic "plate" — the visual identity of a project. Lines are drawn in by
 * the reveal system (data-reveal="draw").
 */
export function Plate({ seed, tone, caption, aside, className = '', reveal = true, parallax = false }: {
  seed: string
  tone: string
  caption?: string
  aside?: string
  className?: string
  reveal?: boolean
  /** Lines drift with scroll (driven from the page via [data-parallax]). */
  parallax?: boolean
}) {
  const paths = useMemo(() => contours(seed, 400, 300), [seed])
  return (
    <figure className={`plate relative overflow-hidden ${className}`} style={{ backgroundColor: tone }}>
      <div data-parallax={parallax || undefined} className={`absolute inset-0 ${parallax ? 'scale-[1.14]' : ''}`}>
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="plate-lines absolute inset-0 h-full w-full"
        data-reveal={reveal ? 'draw' : undefined}
        aria-hidden
      >
        {paths.map((d, i) => (
          <path key={i} d={d} data-draw fill="none" stroke="var(--paper)" strokeOpacity={i % 5 === 4 ? 0.62 : 0.3} strokeWidth={i % 5 === 4 ? 1.1 : 0.7} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      </div>
      <div className="paper-grain absolute inset-0 opacity-50 mix-blend-multiply" />
      {(caption || aside) && (
        <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/85 sm:p-5">
          <span>{caption}</span>
          <span className="text-right">{aside}</span>
        </figcaption>
      )}
    </figure>
  )
}
