import type { Project } from '../../types'
import { useInView } from '../../hooks'

interface ProjectCardProps {
  project: Project
  index: number
  parentInView: boolean
}

export default function ProjectCard({ project, index, parentInView }: ProjectCardProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.08 })

  return (
    <div
      ref={ref}
      className={`proj-card animate-in ${inView && parentInView ? 'animate-in--visible' : ''}`}
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      <div className="proj-card__top">
        <div className="proj-card__name-row">
          <h3 className="proj-card__name">{project.name}</h3>
          <span className="proj-card__status">{project.status}</span>
        </div>
        <p className="proj-card__description">{project.description}</p>
      </div>

      <div className="proj-card__bottom">
        <div className="proj-card__stack">
          {project.stack.map(t => (
            <span key={t} className="proj-card__tag">{t}</span>
          ))}
        </div>

        <div className="proj-card__links">
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="proj-card__link">
            GitHub ↗
          </a>
          <a href={project.live} target="_blank" rel="noopener noreferrer" className="proj-card__link proj-card__link--primary">
            Live ↗
          </a>
        </div>
      </div>
    </div>
  )
}
