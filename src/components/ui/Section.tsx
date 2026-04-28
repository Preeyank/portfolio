import type { ReactNode } from 'react'
import { useInView } from '../../hooks'
import ScrambleText from './ScrambleText'

interface SectionProps {
  id: string
  label: string
  title: string
  onTitleComplete?: () => void
  /** BEM block name for the section (e.g. "experience", "projects"). Drives header class names. */
  block: string
  children: ReactNode | ((inView: boolean) => ReactNode)
}

export default function Section({ id, label, title, onTitleComplete, block, children }: SectionProps) {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <section
      id={id}
      ref={ref}
      className={`${block} animate-in ${inView ? 'animate-in--visible' : ''}`}
    >
      <div className={`${block}__inner`}>
        <div className={`${block}__header`}>
          <span className={`${block}__label`}>{label}</span>
          <h2 className={`${block}__title`}>
            <ScrambleText text={title} onComplete={onTitleComplete} />
          </h2>
        </div>
        {typeof children === 'function' ? children(inView) : children}
      </div>
    </section>
  )
}
