import { useInView } from '../../hooks/useInView'
import ScrambleText from '../../components/ScrambleText'
import './Contact.css'

const LINKS = [
  { label: 'Email', value: 'bardoliapriyank05@gmail.com', href: 'mailto:bardoliapriyank05@gmail.com' },
  { label: 'LinkedIn', value: 'priyank-bardolia', href: 'https://www.linkedin.com/in/priyank-bardolia/' },
  { label: 'GitHub', value: 'Preeyank', href: 'https://github.com/Preeyank' },
]

export default function Contact() {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <section id="contact" ref={ref} className={`contact animate-in ${inView ? 'animate-in--visible' : ''}`}>
      <div className="contact__inner">
        <div className="contact__header">
          <span className="contact__label">Contact</span>
          <h2 className="contact__title"><ScrambleText text="Let's work together" /></h2>
          <p className="contact__subtitle">
            Open to full-time roles, contract work, and interesting conversations.
          </p>
        </div>

        <div className="contact__links">
          {LINKS.map(({ label, value, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="contact__link">
              <span className="contact__link-label">{label}</span>
              <span className="contact__link-value">{value} ↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
