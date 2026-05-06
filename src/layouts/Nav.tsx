import { useEffect, useState } from 'react'
import { MagneticButton } from '../components/ui'
import { NAV_LINKS } from '../content'

interface NavProps {
  onOpenPalette: () => void
}

export default function Nav({ onOpenPalette }: NavProps) {
  const [active, setActive] = useState('')
  const [isMac] = useState(() =>
    typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
  )

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[]

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id)
    if (el) {
      e.preventDefault()
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleLogoClick = () => {
    const hero = document.querySelector('.hero') as HTMLElement | null
    if (hero) hero.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav className="nav">
      <button type="button" className="nav__logo" onClick={handleLogoClick} aria-label="Scroll to top">
        preeyank.dev
      </button>

      <ul className="nav__links">
        {NAV_LINKS.map(({ label, id }) => (
          <li key={id}>
            <MagneticButton strength={0.3}>
              <a
                href={`#${id}`}
                className={`nav__link ${active === id ? 'nav__link--active' : ''}`}
                onClick={(e) => handleClick(e, id)}
              >
                {label}
              </a>
            </MagneticButton>
          </li>
        ))}
      </ul>

      <div className="nav__status">
        <button
          type="button"
          className="nav__cmdk"
          onClick={onOpenPalette}
          aria-label="Open command palette"
          title="Open command palette"
        >
          <kbd className="nav__cmdk-key">{isMac ? '⌘' : 'ctrl'}</kbd>
          <kbd className="nav__cmdk-key">K</kbd>
        </button>
        <span className="nav__divider" aria-hidden="true" />
        <span className="nav__dot" />
        <span className="nav__status-text">Available for work</span>
      </div>
    </nav>
  )
}
