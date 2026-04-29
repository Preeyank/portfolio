import { Section } from '../../components/ui'
import { JOBS } from '../../content'
import ExperienceCard from './ExperienceCard'
import './Experience.css'

export default function Experience() {
  return (
    <Section id="work" block="experience" label="Experience" title="Where I've built">
      {(inView) => (
        <div className="experience__list">
          {JOBS.map((job, idx) => (
            <ExperienceCard key={job.company} job={job} index={idx} parentInView={inView} />
          ))}
        </div>
      )}
    </Section>
  )
}
