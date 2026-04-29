import { useEffect, useState } from 'react'
import { MagneticButton } from '../components/ui'
import { NAV_LINKS } from '../content'

export default function Nav() {
  const [active, setActive] = useState('')

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

  return (
    <nav className="nav">
      <span className="nav__logo">preeyank.dev</span>

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
        <span className="nav__dot" />
        <span className="nav__status-text">Available for work</span>
      </div>
    </nav>
  )
}
