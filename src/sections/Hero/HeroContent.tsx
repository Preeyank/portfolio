import { useEffect, useRef, useState } from 'react'
import MagneticButton from '../../components/MagneticButton'
import pythonIcon from '../../assets/python.svg'
import awsIcon from '../../assets/aws.svg'
import dynamodbIcon from '../../assets/dynamodb.svg'

const STACK: { label: string; icon: string; color: string }[] = [
  { label: 'Python',     icon: pythonIcon,                               color: '55,118,171'  },
  { label: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript', color: '49,120,198'  },
  { label: 'React',      icon: 'https://cdn.simpleicons.org/react',      color: '97,218,251'  },
  { label: 'Next.js',    icon: 'https://cdn.simpleicons.org/nextdotjs',  color: '255,255,255' },
  { label: 'FastAPI',    icon: 'https://cdn.simpleicons.org/fastapi',    color: '0,150,136'   },
  { label: 'Node.js',    icon: 'https://cdn.simpleicons.org/nodedotjs',  color: '95,160,78'   },
  { label: 'AWS',        icon: awsIcon,                                  color: '255,153,0'   },
  { label: 'DynamoDB',   icon: dynamodbIcon,                              color: '64,83,214'   },
  { label: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql', color: '65,105,225'  },
  { label: 'Docker',     icon: 'https://cdn.simpleicons.org/docker',     color: '36,150,237'  },
  { label: 'Go',         icon: 'https://cdn.simpleicons.org/go',         color: '0,172,215'   },
]
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&'
const NAME_UPRIGHT = 'Pri'
const NAME_ITALIC = 'yank'
const EMAIL = 'bardoliapriyank05@gmail.com'

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


interface HeroContentProps {
  visible: boolean
}

export default function HeroContent({ visible }: HeroContentProps) {
  const uprightText = useScramble(NAME_UPRIGHT, 700)
  const italicText  = useScramble(NAME_ITALIC,  1000)
  const { revealed, cursorVisible, done } = useTerminalPills(STACK.map(s => s.label), 1500)
  const { copied, copy } = useCopyEmail()

  return (
    <main className="hero__main">
      {/* Eyebrow pill — click to copy email */}
      <div className="hero__fade-up" style={{ animationDelay: '0.4s', opacity: visible ? 1 : 0 }}>
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
      <div className="hero__fade-up" style={{ animationDelay: '0.6s', opacity: visible ? 1 : 0 }}>
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
      <div className="hero__fade-up" style={{ animationDelay: '0.85s', opacity: visible ? 1 : 0 }}>
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
      <div className="hero__fade-up" style={{ animationDelay: '1.05s', opacity: visible ? 1 : 0 }}>
        <div className="hero__stack">
          {STACK.map(({ label, icon, color }, i) => (
            <span
              key={label}
              className={`hero__pill ${i < revealed ? 'hero__pill--visible' : 'hero__pill--hidden'}`}
              style={{ '--pill-color': color } as React.CSSProperties}
            >
              <img src={icon} alt="" className="hero__pill-icon" aria-hidden="true" />
              {label}
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
      <div className="hero__fade-up" style={{ animationDelay: '1.25s', opacity: visible ? 1 : 0 }}>
        <div className="hero__ctas">
          <MagneticButton>
            <a href="#work" className="hero__cta hero__cta--primary">View my work</a>
          </MagneticButton>
          <MagneticButton>
            <a href="#contact" className="hero__cta hero__cta--ghost">Get in touch</a>
          </MagneticButton>
        </div>
      </div>
    </main>
  )
}
