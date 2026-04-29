import { Section } from '../../components/ui'
import { PROJECTS } from '../../content'
import ProjectCard from './ProjectCard'
import './Projects.css'

export default function Projects() {
  return (
    <Section id="projects" block="projects" label="Projects" title="What I'm building">
      {(inView) => (
        <div className="projects__grid">
          {PROJECTS.map((project, idx) => (
            <ProjectCard key={project.name} project={project} index={idx} parentInView={inView} />
          ))}
        </div>
      )}
    </Section>
  )
}
