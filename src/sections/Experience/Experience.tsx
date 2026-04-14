import { useInView } from '../../hooks/useInView'
import ScrambleText from '../../components/ScrambleText'
import './Experience.css'

const JOBS = [
  {
    company: 'GE Healthcare',
    role: 'Software Engineer',
    period: 'Mar 2024 – Present',
    location: 'Seattle, WA',
    badge: 'SWE II · Impact Award',
    bullets: [
      'Founding engineer on the DHS Metering Platform — zero-to-one cloud-native system processing billions of usage events for enterprise billing and analytics.',
      'Promoted to Software Engineer II within 10 months; recognized with the GEHC Impact Award — Engineering Excellence.',
      'Built a Python SDK cutting application onboarding from 3 days to 1 hour — a 95% reduction.',
      'Designed streaming ingestion pipeline (CloudWatch → Kinesis Firehose → Lambda → S3) at billion-event scale.',
      'Led full-stack development with Next.js, React, TypeScript frontend and FastAPI + API Gateway backend, reducing customer onboarding time by 65%.',
      'Owned end-to-end billing notification system (SES, Lambda, DynamoDB, S3) eliminating 100% of manual billing workflows.',
      'Achieved 94% test coverage across frontend and backend (unit, integration, BDD).',
    ],
    stack: ['Python', 'TypeScript', 'Next.js', 'React', 'FastAPI', 'AWS', 'DynamoDB', 'CDK'],
  },
  {
    company: 'Scale AI',
    role: 'AI Coding Specialist',
    period: 'Jan 2024 – Mar 2024',
    location: 'San Francisco, CA',
    badge: null,
    bullets: [
      'Fine-tuned and evaluated LLMs for multi-language code generation using RLHF, improving functional correctness across complex programming tasks.',
      'Developed reference implementations and test cases in Python, JavaScript, TypeScript, Go, and Java — increasing AI code generation efficiency by 20%.',
      'Conducted systematic validation and code reviews of AI-generated outputs, refining evaluation workflows to enhance dataset quality.',
    ],
    stack: ['Python', 'TypeScript', 'JavaScript', 'Go', 'Java'],
  },
  {
    company: 'Cepheid',
    role: 'Software Engineer',
    period: 'May 2022 – Aug 2022',
    location: 'San Jose, CA',
    badge: null,
    bullets: [
      'Designed and developed a C# .NET application with SQL Server backend and Windows Forms UI serving 10,000+ users.',
      'Implemented RBAC and workflow automation; migrated legacy Visual C++ components to C#.',
      'Integrated GitLab CI/CD pipelines — reducing deployment time by 60% and increasing release frequency by 40%.',
    ],
    stack: ['C#', '.NET', 'SQL Server', 'GitLab CI/CD'],
  },
]

export default function Experience() {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <section id="work" ref={ref} className={`experience animate-in ${inView ? 'animate-in--visible' : ''}`}>
      <div className="experience__inner">
        <div className="experience__header">
          <span className="experience__label">Experience</span>
          <h2 className="experience__title"><ScrambleText text="Where I've built" /></h2>
        </div>

        <div className="experience__list">
          {JOBS.map((job, idx) => (
            <ExperienceCard key={job.company} job={job} index={idx} parentInView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ExperienceCard({ job, index, parentInView }: { job: typeof JOBS[0]; index: number; parentInView: boolean }) {
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
            <li key={i} className="exp-card__bullet">{b}</li>
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
