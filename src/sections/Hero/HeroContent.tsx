import { useEffect, useRef, useState } from 'react'

const STACK = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL', 'Redis', 'Docker', 'AWS']
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&'
const NAME_UPRIGHT = 'Pri'
const NAME_ITALIC = 'yank'
const EMAIL = 'priyank@example.com'

// ── Scramble hook ──────────────────────────────────────────────
function useScramble(target: string, delay: number = 0) {
  const [display, setDisplay] = useState('')
  const frameRef = useRef(0)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    timeout = setTimeout(() => {
      let iteration = 0
      const total = target.length * 6

      const tick = () => {
        setDisplay(
          target
            .split('')
            .map((_, i) => {
              if (i < Math.floor(iteration / 6)) return target[i]
              return CHARS[Math.floor(Math.random() * CHARS.length)]
            })
            .join('')
        )
        iteration++
        if (iteration <= total) {
          frameRef.current = requestAnimationFrame(tick)
        } else {
          setDisplay(target)
        }
      }
      frameRef.current = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(frameRef.current)
    }
  }, [target, delay])

  return display
}

// ── Terminal pills hook ────────────────────────────────────────
function useTerminalPills(pills: string[], startDelay: number = 400) {
  const [revealed, setRevealed] = useState(0)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (revealed >= pills.length) {
      setDone(true)
      return
    }
    const t = setTimeout(() => setRevealed((r) => r + 1), startDelay + revealed * 60)
    return () => clearTimeout(t)
  }, [revealed, pills.length, startDelay])

  useEffect(() => {
    if (done) { setCursorVisible(false); return }
    const t = setInterval(() => setCursorVisible((v) => !v), 530)
    return () => clearInterval(t)
  }, [done])

  return { revealed, cursorVisible, done }
}

// ── Copy email pill hook ───────────────────────────────────────
function useCopyEmail() {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return { copied, copy }
}

// ── Line numbers (with one slot reserved for elapsed timer) ────
const LINE_COUNT = 18
const TIMER_SLOT = 9 // which line index shows the timer

function useElapsed() {
  const [s, setS] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setS((n) => n + 1), 1000)
    return () => clearInterval(t)
  }, [])
  const mm = String(Math.floor(s / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

interface HeroContentProps {
  visible: boolean
}

export default function HeroContent({ visible }: HeroContentProps) {
  const uprightText = useScramble(NAME_UPRIGHT, 300)
  const italicText  = useScramble(NAME_ITALIC,  600)
  const { revealed, cursorVisible, done } = useTerminalPills(STACK, 900)
  const { copied, copy } = useCopyEmail()
  const elapsed = useElapsed()

  return (
    <main className="hero__main">
      {/* Decorative line numbers with hidden elapsed timer */}
      <div className="hero__gutter" aria-hidden="true">
        {Array.from({ length: LINE_COUNT }, (_, i) => (
          <span key={i} className="hero__gutter-line">
            {i === TIMER_SLOT ? elapsed : String(i + 1).padStart(2, '0')}
          </span>
        ))}
      </div>

      {/* Eyebrow pill — click to copy email */}
      <div className="hero__fade-up" style={{ animationDelay: '0s', opacity: visible ? 1 : 0 }}>
        <div className="hero__eyebrow">
          <span className="hero__eyebrow-line" />
          <button
            className={`hero__eyebrow-text hero__eyebrow-btn ${copied ? 'hero__eyebrow-btn--copied' : ''}`}
            onClick={copy}
            title={`Copy ${EMAIL}`}
          >
            {copied ? 'copied ✓' : 'Full Stack Developer'}
          </button>
          <span className="hero__eyebrow-line" />
        </div>
      </div>

      {/* Name — scramble reveal + hover split */}
      <div className="hero__fade-up" style={{ animationDelay: '0.1s', opacity: visible ? 1 : 0 }}>
        <h1 className="hero__name hero__name--splittable">
          <span className="hero__name--upright hero__name--split-left">
            {uprightText || NAME_UPRIGHT}
          </span>
          <span className="hero__name--italic hero__name--split-right">
            {italicText || NAME_ITALIC}
          </span>
        </h1>
      </div>

      {/* Tagline — redacted words revealed on hover */}
      <div className="hero__fade-up" style={{ animationDelay: '0.2s', opacity: visible ? 1 : 0 }}>
        <div className="hero__tagline-row">
          <span className="hero__tagline-dash">—</span>
          <p className="hero__tagline">
            <span className="hero__redact">Building</span>
            {' '}for the{' '}
            <span className="hero__redact">web</span>
            {' '}&amp;{' '}
            <span className="hero__redact">beyond</span>
          </p>
          <span className="hero__tagline-dash">—</span>
        </div>
      </div>

      {/* Stack pills — terminal print */}
      <div className="hero__fade-up" style={{ animationDelay: '0.3s', opacity: visible ? 1 : 0 }}>
        <div className="hero__stack">
          {STACK.map((tech, i) => (
            <span
              key={tech}
              className={`hero__pill ${i < revealed ? 'hero__pill--visible' : 'hero__pill--hidden'}`}
            >
              {tech}
            </span>
          ))}
          {!done && (
            <span className="hero__terminal-cursor" style={{ opacity: cursorVisible ? 1 : 0 }}>
              ▋
            </span>
          )}
        </div>
      </div>

      {/* CTAs */}
      <div className="hero__fade-up" style={{ animationDelay: '0.4s', opacity: visible ? 1 : 0 }}>
        <div className="hero__ctas">
          <a href="#work" className="hero__cta hero__cta--primary">View my work</a>
          <a href="#contact" className="hero__cta hero__cta--ghost">Get in touch</a>
        </div>
      </div>
    </main>
  )
}
