import { useState } from 'react'
import { useInView } from '../../hooks/useInView'
import ScrambleText from '../../components/ScrambleText'
import CountUp from '../../components/CountUp'
import './About.css'

const FACTS = [
  { value: '3+',   label: 'years in production' },
  { value: '94%',  label: 'test coverage at GEHC' },
  { value: '95%',  label: 'onboarding time cut' },
  { value: '10B+', label: 'events processed' },
]

export default function About() {
  const { ref, inView } = useInView<HTMLElement>()
  const [statsReady, setStatsReady] = useState(false)

  return (
    <section id="about" ref={ref} className={`about animate-in ${inView ? 'animate-in--visible' : ''}`}>
      <div className="about__inner">
        <div className="about__header">
          <span className="about__label">About</span>
          <h2 className="about__title">
            <ScrambleText text="The person behind the code" onComplete={() => setStatsReady(true)} />
          </h2>
        </div>

        <div className="about__body">
          <div className="about__text">
            <p>
              I'm a full-stack software engineer based in Seattle, WA — currently building cloud-native platforms at GE Healthcare. I was the founding engineer on a metering system that went from zero to processing billions of events in production, onboarding 6 enterprise customers in its first year.
            </p>
            <p>
              My work sits at the intersection of backend infrastructure and product-facing interfaces — I care as much about the system architecture as I do about the experience using it. I've built SDKs, streaming pipelines, billing systems, and the UIs that make them usable.
            </p>
            <p>
              Outside of work, I'm building API Sentinel — an AI-powered monitoring tool. I'm drawn to problems where reliability and developer experience meet.
            </p>
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
      </div>
    </section>
  )
}
