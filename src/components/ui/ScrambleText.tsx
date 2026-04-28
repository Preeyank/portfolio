import { useScramble } from '../../hooks'

interface ScrambleTextProps {
  text: string
  duration?: number
  className?: string
  onComplete?: () => void
}

export default function ScrambleText({ text, duration = 950, className, onComplete }: ScrambleTextProps) {
  const { ref, display } = useScramble(text, duration, onComplete)
  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className={className}>
      {display}
    </span>
  )
}
