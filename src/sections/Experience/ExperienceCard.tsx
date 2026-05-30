import type { Job, JobBullet } from '../../types'
import { useInView } from '../../hooks'

interface ExperienceCardProps {
  job: Job
  index: number
  parentInView: boolean
}

function handleAnchorClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith('#')) return
  const id = href.slice(1)
  const el = document.getElementById(id)
  if (!el) return
  e.preventDefault()
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function renderBullet(b: JobBullet) {
  if (typeof b === 'string') return b
  return b.map((seg, i) =>
    seg.kind === 'text' ? (
      <span key={i}>{seg.text}</span>
    ) : (
      <a
        key={i}
        href={seg.href}
        className="exp-card__bullet-link"
        onClick={(e) => handleAnchorClick(e, seg.href)}
      >
        {seg.text}
      </a>
    ),
  )
}

export default function ExperienceCard({ job, index, parentInView }: ExperienceCardProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.08 })

  return (
    <div
      ref={ref}
      className={`exp-card animate-in ${inView && parentInView ? 'animate-in--visible' : ''}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className="exp-card__left">
        <span className="exp-card__period">{job.period}</span>
        <span className="exp-card__location">{job.location}</span>
      </div>

      <div className="exp-card__right">
        <div className="exp-card__top">
          <h3 className="exp-card__company">{job.company}</h3>
          <span className="exp-card__role">{job.role}</span>
          {job.badge && <span className="exp-card__badge">{job.badge}</span>}
        </div>

        <ul className="exp-card__bullets">
          {job.bullets.map((b, i) => (
            <li key={i} className="exp-card__bullet">{renderBullet(b)}</li>
          ))}
        </ul>

        <div className="exp-card__stack">
          {job.stack.map(t => (
            <span key={t} className="exp-card__tag">{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
