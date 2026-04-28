import { useInView } from '../../hooks'
import './SectionDivider.css'

export default function SectionDivider() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.5 })

  return (
    <div ref={ref} className={`section-divider ${inView ? 'section-divider--visible' : ''}`}>
      <div className="section-divider__line" />
    </div>
  )
}
