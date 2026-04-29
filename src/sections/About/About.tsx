import { useState } from 'react'
import { Section, CountUp } from '../../components/ui'
import { FACTS, BIO } from '../../content'
import './About.css'

export default function About() {
  const [statsReady, setStatsReady] = useState(false)

  return (
    <Section
      id="about"
      block="about"
      label="About"
      title="The person behind the code"
      onTitleComplete={() => setStatsReady(true)}
    >
      <div className="about__body">
        <div className="about__text">
          {BIO.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <div className="about__stats">
          {FACTS.map(({ value, label }) => (
            <div key={label} className="about__stat">
              <CountUp value={value} ready={statsReady} className="about__stat-value" />
              <span className="about__stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
