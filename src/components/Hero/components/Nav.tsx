const NAV_LINKS = ['Work', 'About', 'Writing', 'Contact']

export default function Nav() {
  return (
    <nav className="hero__nav">
      <span className="hero__nav-logo">preeyank.dev</span>

      <ul className="hero__nav-links">
        {NAV_LINKS.map((label) => (
          <li key={label}>
            <a href={`#${label.toLowerCase()}`} className="hero__nav-link">
              {label}
            </a>
          </li>
        ))}
      </ul>

      <div className="hero__nav-status">
        <span className="hero__nav-dot" />
        <span className="hero__nav-status-text">Available for work</span>
      </div>
    </nav>
  )
}
