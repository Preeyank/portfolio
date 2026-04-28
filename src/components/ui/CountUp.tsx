import { useCountUp } from '../../hooks'

interface CountUpProps {
  value: string
  ready: boolean
  duration?: number
  className?: string
}

export default function CountUp({ value, ready, duration = 2000, className }: CountUpProps) {
  const display = useCountUp(value, ready, duration)
  return <span className={className}>{display}</span>
}
