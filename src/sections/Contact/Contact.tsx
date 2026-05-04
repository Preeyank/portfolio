import { useInView } from '../../hooks'
import { ScrambleText } from '../../components/ui'
import { CONTACT_LINKS, RESUME_URL, RESUME_FILENAME } from '../../content'
import './Contact.css'

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
          {CONTACT_LINKS.map(({ label, value, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="contact__link">
              <span className="contact__link-label">{label}</span>
              <span className="contact__link-value">{value} ↗</span>
            </a>
          ))}
          <a href={RESUME_URL} download={RESUME_FILENAME} className="contact__link">
            <span className="contact__link-label">Resume</span>
            <span className="contact__link-value">download ↓</span>
          </a>
        </div>

        <p className="contact__footnote">v1.0.0 · built with react + obsession · <span className="contact__hint" title="try it">↑↑↓↓</span></p>
      </div>
    </section>
  )
}
