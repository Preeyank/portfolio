import { Section } from '../../components/ui'
import { NOW_ITEMS, NOW_UPDATED } from '../../content'
import './Now.css'

export default function Now() {
  return (
    <Section
      id="now"
      block="now"
      label="Now"
      title="What I'm into right now"
    >
      <div className="now__panel">
        <div className="now__meta">
          <span className="now__pulse" aria-hidden="true">
            <span className="now__pulse-dot" />
          </span>
          <span className="now__updated">Last updated {NOW_UPDATED}</span>
        </div>

        <ul className="now__list">
          {NOW_ITEMS.map(({ label, value }) => (
            <li key={label} className="now__item">
              <span className="now__item-label">{label}</span>
              <span className="now__item-value">{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
