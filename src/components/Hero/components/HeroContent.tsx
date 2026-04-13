const STACK = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL', 'Redis', 'Docker', 'AWS']

interface HeroContentProps {
  visible: boolean
}

export default function HeroContent({ visible }: HeroContentProps) {
  return (
    <main className="hero__main">
      {/* Eyebrow pill */}
      <div
        className="hero__fade-up"
        style={{ animationDelay: '0s', opacity: visible ? 1 : 0 }}
      >
        <div className="hero__eyebrow">
          <span className="hero__eyebrow-line" />
          <span className="hero__eyebrow-text">Full Stack Developer</span>
          <span className="hero__eyebrow-line" />
        </div>
      </div>

      {/* Name */}
      <div
        className="hero__fade-up"
        style={{ animationDelay: '0.1s', opacity: visible ? 1 : 0 }}
      >
        <h1 className="hero__name">
          <span className="hero__name--upright">Pri</span>
          <span className="hero__name--italic">yank</span>
        </h1>
      </div>

      {/* Tagline */}
      <div
        className="hero__fade-up"
        style={{ animationDelay: '0.2s', opacity: visible ? 1 : 0 }}
      >
        <div className="hero__tagline-row">
          <span className="hero__tagline-dash">—</span>
          <p className="hero__tagline">Building for the web &amp; beyond</p>
          <span className="hero__tagline-dash">—</span>
        </div>
      </div>

      {/* Stack pills */}
      <div
        className="hero__fade-up"
        style={{ animationDelay: '0.3s', opacity: visible ? 1 : 0 }}
      >
        <div className="hero__stack">
          {STACK.map((tech) => (
            <span key={tech} className="hero__pill">{tech}</span>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div
        className="hero__fade-up"
        style={{ animationDelay: '0.4s', opacity: visible ? 1 : 0 }}
      >
        <div className="hero__ctas">
          <a href="#work" className="hero__cta hero__cta--primary">
            View my work
          </a>
          <a href="#contact" className="hero__cta hero__cta--ghost">
            Get in touch
          </a>
        </div>
      </div>
    </main>
  )
}
