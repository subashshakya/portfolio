import { profile } from '../data/resume'

export function Footer() {
  const time = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Kathmandu', hour: '2-digit', minute: '2-digit' }).format(new Date())
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto grid max-w-[1320px] gap-6 px-4 py-10 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3 sm:px-8 md:grid-cols-3">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p className="md:text-center">Set in Fraunces &amp; Instrument Sans · Moved by anime.js</p>
        <p className="md:text-right">{profile.location} · {time} NPT</p>
      </div>
    </footer>
  )
}
