const NAV_LINKS = ['Work', 'About', 'Writing', 'Contact']

export default function Nav() {
  return (
    <nav className="nav">
      <span className="nav__logo">preeyank.dev</span>

      <ul className="nav__links">
        {NAV_LINKS.map((label) => (
          <li key={label}>
            <a href={`#${label.toLowerCase()}`} className="nav__link">
              {label}
            </a>
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
