import { createContext, useCallback, useContext, useRef, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { useHref, useLocation, useNavigate } from 'react-router-dom'
import { createTimeline, utils } from 'animejs'
import { closeGate, dur, ease, prefersReduced, releaseGate } from '../motion'

type Go = (to: string, opts?: { label?: string; color?: string }) => void
const Ctx = createContext<Go>(() => {})
export const usePageTransition = () => useContext(Ctx)

/** A paper curtain that rises over the page, carries a label, then lifts away on the new route. */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const curtain = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const busy = useRef(false)

  const go = useCallback<Go>((to, opts = {}) => {
    if (busy.current) return
    if (prefersReduced() || !curtain.current || !label.current) { navigate(to); return }
    busy.current = true
    const c = curtain.current
    const l = label.current
    l.textContent = opts.label ?? ''
    utils.set(c, { visibility: 'visible', backgroundColor: opts.color ?? 'var(--ink)', scaleY: 0, transformOrigin: '50% 100%' })
    utils.set(l, { opacity: 0, y: 40 })

    createTimeline({ defaults: { ease: ease.inOut } })
      .add(c, { scaleY: 1, duration: dur.base + 80 })
      .add(l, { opacity: 1, y: 0, duration: dur.base, ease: ease.out }, '-=260')
      .call(() => {
        closeGate()
        navigate(to)
      })
      .set(c, { transformOrigin: '50% 0%' }, '+=220')
      .add(l, { opacity: 0, y: -30, duration: dur.quick + 80, ease: ease.inOut })
      .call(() => releaseGate(), '-=80')
      .add(c, { scaleY: 0, duration: dur.slow - 100 }, '<<+=120')
      .call(() => {
        utils.set(c, { visibility: 'hidden' })
        busy.current = false
      })
  }, [navigate])

  return (
    <Ctx.Provider value={go}>
      {children}
      <div
        ref={curtain}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] grid place-items-center"
        style={{ visibility: 'hidden' }}
      >
        <span ref={label} className="font-display text-[clamp(2.5rem,8vw,6rem)] italic text-paper" />
      </div>
    </Ctx.Provider>
  )
}

type TLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string; label?: string; color?: string }

/** Internal link that routes through the curtain; same-page hashes scroll smoothly instead. */
export function TLink({ to, label, color, onClick, children, ...rest }: TLinkProps) {
  const go = usePageTransition()
  const { pathname } = useLocation()
  const href = useHref(to)
  return (
    <a
      href={href}
      {...rest}
      onClick={e => {
        onClick?.(e)
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        const [path, hash] = to.split('#')
        if ((path || '/') === pathname) {
          if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })
          else window.scrollTo({ top: 0, behavior: 'smooth' })
          return
        }
        go(to, { label, color })
      }}
    >
      {children}
    </a>
  )
}
