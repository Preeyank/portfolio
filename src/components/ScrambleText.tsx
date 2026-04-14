import { useScramble } from '../hooks/useScramble'

interface ScrambleTextProps {
  text: string
  duration?: number
  className?: string
}

export default function ScrambleText({ text, duration = 950, className }: ScrambleTextProps) {
  const { ref, display } = useScramble(text, duration)
  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className={className}>
      {display}
    </span>
  )
}
