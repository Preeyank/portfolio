import { useInView } from '../../hooks/useInView'
import ScrambleText from '../../components/ScrambleText'
import './Projects.css'

const PROJECTS = [
  {
    name: 'API Sentinel',
    status: 'In Progress',
    description: 'AI-powered API uptime monitoring SaaS. Detects outages, triages incidents automatically, and notifies you before your users do.',
    stack: ['TypeScript', 'Next.js', 'PostgreSQL', 'Prisma', 'Better Auth', 'shadcn/ui', 'Vercel', 'Claude API'],
    live: 'https://apisentinelhq.vercel.app',
    github: 'https://github.com/Preeyank/api-sentinel',
  },
]

export default function Projects() {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <section id="projects" ref={ref} className={`projects animate-in ${inView ? 'animate-in--visible' : ''}`}>
      <div className="projects__inner">
        <div className="projects__header">
          <span className="projects__label">Projects</span>
          <h2 className="projects__title"><ScrambleText text="What I'm building" /></h2>
        </div>

        <div className="projects__grid">
          {PROJECTS.map((project, idx) => (
            <ProjectCard key={project.name} project={project} index={idx} parentInView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
  parentInView,
}: {
  project: typeof PROJECTS[0]
  index: number
  parentInView: boolean
}) {
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
