import { useEffect, useState } from 'react'

const STACK = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL', 'Redis', 'Docker', 'AWS']

export default function Hero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <div style={styles.root}>
      {/* Background layers */}
      <div style={styles.grid} />
      <div style={styles.gridFade} />
      <div style={styles.glow} />

      {/* Nav */}
      <nav style={styles.nav}>
        <span style={styles.navLogo}>preeyank.dev</span>

        <ul style={styles.navLinks}>
          {['Work', 'About', 'Writing', 'Contact'].map((label) => (
            <li key={label}>
              <a href={`#${label.toLowerCase()}`} style={styles.navLink}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div style={styles.navStatus}>
          <span style={styles.dot} />
          <span style={styles.navStatusText}>Available for work</span>
        </div>
      </nav>

      {/* Hero content */}
      <main style={styles.main}>
        {/* Eyebrow pill */}
        <div style={{ ...styles.fadeUp, animationDelay: '0s', opacity: visible ? 1 : 0 }}>
          <div style={styles.eyebrow}>
            <span style={styles.eyebrowLine} />
            <span style={styles.eyebrowText}>Full Stack Developer</span>
            <span style={styles.eyebrowLine} />
          </div>
        </div>

        {/* Name */}
        <div style={{ ...styles.fadeUp, animationDelay: '0.1s', opacity: visible ? 1 : 0 }}>
          <h1 style={styles.name}>
            <span style={styles.nameUpright}>Pri</span>
            <span style={styles.nameItalic}>yank</span>
          </h1>
        </div>

        {/* Tagline */}
        <div style={{ ...styles.fadeUp, animationDelay: '0.2s', opacity: visible ? 1 : 0 }}>
          <div style={styles.taglineRow}>
            <span style={styles.taglineDash}>—</span>
            <p style={styles.tagline}>Building for the web &amp; beyond</p>
            <span style={styles.taglineDash}>—</span>
          </div>
        </div>

        {/* Stack pills */}
        <div style={{ ...styles.fadeUp, animationDelay: '0.3s', opacity: visible ? 1 : 0 }}>
          <div style={styles.stack}>
            {STACK.map((tech) => (
              <StackPill key={tech} label={tech} />
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div style={{ ...styles.fadeUp, animationDelay: '0.4s', opacity: visible ? 1 : 0 }}>
          <div style={styles.ctas}>
            <CTAPrimary />
            <CTAGhost />
          </div>
        </div>
      </main>

      {/* Bottom bar */}
      <div style={{ ...styles.fadeUp, ...styles.bottomBar, animationDelay: '0.5s', opacity: visible ? 1 : 0 }}>
        <span style={styles.bottomLeft}>
          Currently building →&nbsp;
          <span style={styles.bottomProject}>API Sentinel</span>
        </span>

        <div style={styles.bottomCenter}>
          <span style={styles.scrollLabel}>Scroll</span>
          <span style={styles.scrollArrow}>◆</span>
        </div>

        <span style={styles.bottomRight}>21.1702° N, 72.8311° E</span>
      </div>

      <style>{keyframes}</style>
    </div>
  )
}

/* ── Sub-components ── */

function StackPill({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <span
      style={{
        ...styles.pill,
        color: hovered ? 'rgba(124,158,247,0.9)' : 'rgba(255,255,255,0.4)',
        borderColor: hovered ? 'rgba(124,158,247,0.5)' : 'rgba(255,255,255,0.1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </span>
  )
}

function CTAPrimary() {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href="#work"
      style={{
        ...styles.ctaBase,
        ...styles.ctaPrimary,
        opacity: hovered ? 0.88 : 1,
        transform: hovered ? 'translateY(-1px)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      View my work
    </a>
  )
}

function CTAGhost() {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href="#contact"
      style={{
        ...styles.ctaBase,
        ...styles.ctaGhost,
        borderColor: hovered ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.14)',
        color: hovered ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)',
        transform: hovered ? 'translateY(-1px)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      Get in touch
    </a>
  )
}

/* ── Styles ── */

const styles: Record<string, React.CSSProperties> = {
  root: {
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#0b0c0e',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  /* Background grid */
  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.032) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.032) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
  },
  gridFade: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse 100% 60% at 50% 100%, #0b0c0e 55%, transparent 100%)',
    pointerEvents: 'none',
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '70%',
    height: '40%',
    background: 'radial-gradient(ellipse at 50% 0%, rgba(100,140,255,0.07) 0%, transparent 70%)',
    pointerEvents: 'none',
  },

  /* Nav */
  nav: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 40px',
    height: '64px',
    borderBottom: '0.5px solid rgba(255,255,255,0.07)',
    flexShrink: 0,
  },
  navLogo: {
    fontFamily: '"DM Mono", monospace',
    fontSize: '13px',
    fontWeight: 400,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: '0.02em',
    flex: '1 1 0',
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '36px',
    alignItems: 'center',
    flex: '0 0 auto',
  },
  navLink: {
    fontFamily: '"Instrument Sans", sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
    transition: 'color 0.2s',
    letterSpacing: '0.01em',
  },
  navStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: '1 1 0',
    justifyContent: 'flex-end',
  },
  dot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: '#4ade80',
    flexShrink: 0,
    animation: 'pulse-dot 2.4s ease-in-out infinite',
  },
  navStatusText: {
    fontFamily: '"DM Mono", monospace',
    fontSize: '12px',
    fontWeight: 300,
    color: 'rgba(255,255,255,0.38)',
    letterSpacing: '0.03em',
  },

  /* Main content */
  main: {
    position: 'relative',
    zIndex: 10,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '28px',
    padding: '60px 24px',
  },

  /* Eyebrow */
  eyebrow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  eyebrowLine: {
    display: 'block',
    width: '32px',
    height: '0.5px',
    backgroundColor: 'rgba(124,158,247,0.35)',
  },
  eyebrowText: {
    fontFamily: '"DM Mono", monospace',
    fontSize: '11px',
    fontWeight: 400,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'rgba(124,158,247,0.85)',
    border: '1px solid rgba(124,158,247,0.2)',
    borderRadius: '100px',
    padding: '5px 14px',
  },

  /* Name */
  name: {
    fontFamily: '"DM Serif Display", serif',
    fontSize: 'clamp(56px, 8vw, 86px)',
    lineHeight: 1.02,
    margin: 0,
    letterSpacing: '-0.02em',
    display: 'inline-block',
  },
  nameUpright: {
    fontStyle: 'normal',
    color: '#ffffff',
  },
  nameItalic: {
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.55)',
  },

  /* Tagline */
  taglineRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  taglineDash: {
    color: 'rgba(255,255,255,0.18)',
    fontSize: '14px',
  },
  tagline: {
    fontFamily: '"Instrument Sans", sans-serif',
    fontSize: '12px',
    fontWeight: 400,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.32)',
  },

  /* Stack pills */
  stack: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
    maxWidth: '600px',
  },
  pill: {
    fontFamily: '"DM Mono", monospace',
    fontSize: '11.5px',
    fontWeight: 400,
    padding: '5px 13px',
    borderRadius: '100px',
    border: '1px solid',
    cursor: 'default',
    transition: 'color 0.22s, border-color 0.22s',
    letterSpacing: '0.03em',
  },

  /* CTAs */
  ctas: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '4px',
  },
  ctaBase: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Instrument Sans", sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    textDecoration: 'none',
    borderRadius: '8px',
    padding: '11px 26px',
    transition: 'opacity 0.2s, transform 0.2s, border-color 0.2s, color 0.2s',
    letterSpacing: '0.01em',
    cursor: 'pointer',
  },
  ctaPrimary: {
    backgroundColor: 'rgba(200,215,255,0.92)',
    color: '#0d0f1a',
    border: 'none',
  },
  ctaGhost: {
    backgroundColor: 'transparent',
    border: '1px solid',
  },

  /* Bottom bar */
  bottomBar: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 40px',
    height: '52px',
    borderTop: '0.5px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
  },
  bottomLeft: {
    fontFamily: '"DM Mono", monospace',
    fontSize: '11px',
    fontWeight: 300,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: '0.03em',
    flex: '1 1 0',
  },
  bottomProject: {
    color: 'rgba(124,158,247,0.75)',
  },
  bottomCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
    flex: '0 0 auto',
  },
  scrollLabel: {
    fontFamily: '"DM Mono", monospace',
    fontSize: '10px',
    fontWeight: 300,
    color: 'rgba(255,255,255,0.22)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  scrollArrow: {
    fontSize: '7px',
    color: 'rgba(255,255,255,0.18)',
    display: 'inline-block',
    transform: 'rotate(45deg)',
    lineHeight: 1,
  },
  bottomRight: {
    fontFamily: '"DM Mono", monospace',
    fontSize: '11px',
    fontWeight: 300,
    color: 'rgba(255,255,255,0.15)',
    letterSpacing: '0.05em',
    flex: '1 1 0',
    textAlign: 'right',
  },

  /* Fade-up animation wrapper */
  fadeUp: {
    animation: 'fade-up 0.65s cubic-bezier(0.22,1,0.36,1) both',
  },
}

const keyframes = `
  @keyframes fade-up {
    from {
      opacity: 0;
      transform: translateY(18px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
`
