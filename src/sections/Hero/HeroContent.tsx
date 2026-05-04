import { MagneticButton } from '../../components/ui'
import { useScrambleOnMount, useTerminalReveal, useCopyToClipboard } from '../../hooks'
import { HERO_STACK, NAME_UPRIGHT, NAME_ITALIC, EMAIL } from '../../content'

interface HeroContentProps {
  visible: boolean
}

export default function HeroContent({ visible }: HeroContentProps) {
  const uprightText = useScrambleOnMount(NAME_UPRIGHT, 700)
  const italicText  = useScrambleOnMount(NAME_ITALIC,  1000)
  const { revealed, cursorVisible, done } = useTerminalReveal(HERO_STACK.length, 1500)
  const { copied, copy } = useCopyToClipboard()

  return (
    <main className="hero__main">
      <div className="hero__fade-up" style={{ animationDelay: '0.4s', opacity: visible ? 1 : 0 }}>
        <div className="hero__eyebrow">
          <span className="hero__eyebrow-line" />
          <button
            className={`hero__eyebrow-text hero__eyebrow-btn ${copied ? 'hero__eyebrow-btn--copied' : ''}`}
            onClick={() => copy(EMAIL)}
            title="Copy email"
          >
            {copied ? 'copied ✓' : 'Full Stack Developer'}
          </button>
          <span className="hero__eyebrow-line" />
        </div>
      </div>

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

      <div className="hero__fade-up" style={{ animationDelay: '1.05s', opacity: visible ? 1 : 0 }}>
        <div className="hero__stack">
          {HERO_STACK.map(({ label, icon, color }, i) => (
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
